from django.db import models

from annoying.fields import JSONField

from integlib.runtime import runtime
from integlib.version import Version

from ..utils import new_dict, repr_attributes
from ..integ_utils import IGNORED_ISSUES, get_latest_version_by_prefix

from .buffer import Buffer


@repr_attributes('key')
class Issue(models.Model):
    VERDICT_NONE = 'pending'
    VERDICT_SUCCEEDED = 'succeeded'
    VERDICT_FAILED = 'failed'
    VERDICT = ((VERDICT_NONE, VERDICT_NONE), (VERDICT_SUCCEEDED, VERDICT_SUCCEEDED),
               (VERDICT_FAILED, VERDICT_FAILED))

    ATTEMPTED_MULTIPLE = '<ATTEMPTED_MULTIPLE>'
    PENDING_BLOCKING = 'PENDING_BLOCKING'

    buffer = models.ForeignKey(Buffer, on_delete=models.CASCADE, related_name='issues', null=True)
    key = models.CharField(max_length=30, unique=True, editable=False)
    props = JSONField(default=new_dict)
    is_running = models.BooleanField(default=False)
    verdict = models.CharField(max_length=10, choices=VERDICT, default=VERDICT_NONE)
    number_tries = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    @staticmethod
    def is_usable(issue_key: str):
        'Whether the issue can be put into queue.'

        if not isinstance(issue_key, str):
            issue_key = issue_key.key

        if issue_key in IGNORED_ISSUES:
            return False

        try:
            issue = Issue.objects.get(key=issue_key)
        except Issue.DoesNotExist:
            return True

        return issue.buffer is None  # and issue.verdict == Issue.VERDICT_FAILED

    @staticmethod
    def create_or_update_props(integ_issue):
        try:
            issue = Issue.objects.get(key=integ_issue.key)
        except Issue.DoesNotExist:
            issue = Issue(key=integ_issue.key)

        issue.update_props(integ_issue)
        issue.save()
        return issue

    def update_props(self, integ_issue):
        preserve_fields = {
            k: v
            for k, v in self.props.items() if k.startswith('<') and k.endswith('>')
        }
        self.props = {
            'fix_versions': integ_issue.fix_versions,
            'priority': integ_issue.priority,
            'assignee_name': integ_issue.assignee.displayName if integ_issue.assignee else '',
            'summary': integ_issue.summary,
        }
        self.props.update(preserve_fields)

        pending_blocking_issues = [
            a.key for a in integ_issue.get_blocking_issues() if a.status_category != 'Done'
        ]
        if pending_blocking_issues:
            self.props[Issue.PENDING_BLOCKING] = pending_blocking_issues

    @property
    def fix_versions(self):
        return self.props.get('fix_versions', [])

    @property
    def priority(self):
        return self.props.get('priority', None)

    @property
    def attempted_multiple(self):
        return Issue.ATTEMPTED_MULTIPLE in self.props

    @property
    def pending_blocking(self):
        return self.props.get(Issue.PENDING_BLOCKING, [])

    @property
    def multiple_similar_versions(self) -> bool:
        'There are 2+ fix versions having the same prefix (first triplet).'

        prefices = {}

        for version in self.fix_versions:
            try:
                prefix = Version(version).triplet_version
            except:
                pass

            if prefix in prefices:
                prefices[prefix] += 1
            else:
                prefices[prefix] = 0

        for count in prefices.values():
            if count:
                return True

        return False

    @property
    def project_key(self) -> str:
        return self.key.rstrip('1234567890-')

    @property
    def has_3_digit_versions(self) -> bool:
        for version in self.fix_versions:
            if Version(version).is_strict_n_digits(3):
                return True

        return False

    def expand_3_digit_versions(self):  # INTEG-2010
        jira_project = runtime.jira.get_project(self.project_key)

        new_versions = set()
        for version in self.fix_versions:
            if Version(version).is_strict_n_digits(3):
                a = get_latest_version_by_prefix(jira_project, version)
                if a:
                    version = a

            new_versions.add(version)

        new_versions = list(new_versions)

        # Update the Jira issue
        integ_issue = runtime.jira.get_issue(self.key)
        integ_issue.set_field('fixVersions', new_versions)

        self.props['fix_versions'] = new_versions
