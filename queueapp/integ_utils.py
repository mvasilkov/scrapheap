from locale import strcoll
from time import time

from django.core.cache import cache

from integlib import common_defs
from integlib.jenkins import BuildNoLongerQueued
from integlib.runtime import runtime
from integlib.version import Version

IGNORED_ISSUES = frozenset(common_defs.EXCLUDED_INTEG_ISSUES)

PRIORITIES = {
    'Blocker': 1,
    'Critical': 2,
    'Major': 3,
    'Minor': 4,
    'Trivial': 5,
    None: 6,
}

QUEUED_SINCE = 'QUEUED_SINCE'
QUEUED_FOR_TOO_LONG = 'QUEUED_FOR_TOO_LONG'
QUEUED_THRESHOLD = 600  # seconds


def jenkins_get_queued_builds(jenkins_job):
    key = f'queued_builds_{jenkins_job.name}'
    result = cache.get(key)
    if result is not None:
        return result
    result = jenkins_job.get_queued_builds()
    cache.set(key, result, 60)
    return result


def jenkins_get_builds(jenkins_job):
    key = f'builds_{jenkins_job.name}'
    result = cache.get(key)
    if result is not None:
        return result
    result = jenkins_job.get_builds()
    cache.set(key, result, 60)
    return result


def issue_running_or_pending(issue, jenkins_job, param_name: str = 'ISSUE') -> bool:
    if not jenkins_job:
        return False

    for build in jenkins_get_queued_builds(jenkins_job):
        try:
            param_issues = str(build.get_params().get(param_name)).split()
            if issue.key in param_issues:
                # queued builds have no build_id
                if QUEUED_SINCE in issue.props:
                    issue.props[QUEUED_FOR_TOO_LONG] = (
                        int(time()) - issue.props[QUEUED_SINCE] > QUEUED_THRESHOLD)
                    issue.save()
                return True
        except BuildNoLongerQueued:
            continue

    for build in jenkins_get_builds(jenkins_job):
        if build.is_running():
            param_issues = str(build.get_params().get(param_name)).split()
            if issue.key in param_issues:
                build_id = getattr(build, 'build_id', None)
                if build_id is not None:
                    issue.props['jenkins_job'] = jenkins_job.name
                    issue.props['jenkins_build_id'] = build_id
                    # clean up queue props
                    if QUEUED_SINCE in issue.props:
                        del issue.props[QUEUED_SINCE]
                    if QUEUED_FOR_TOO_LONG in issue.props:
                        del issue.props[QUEUED_FOR_TOO_LONG]
                    issue.save()
                return True

    return False


def compare_issues_infinidat(a, b) -> int:
    'Compare issues'

    similar_versions_a = int(a.multiple_similar_versions)
    similar_versions_b = int(b.multiple_similar_versions)
    result = similar_versions_b - similar_versions_a
    if result:
        return result

    try:
        fix_version_a = Version(min(a.fix_versions))
        fix_version_b = Version(min(b.fix_versions))
        result = fix_version_a._compare(fix_version_b)
        if result:
            return result
    except:  # cannot compare versions
        pass

    result = PRIORITIES[a.priority] - PRIORITIES[b.priority]
    if result:
        return result

    return strcoll(a.key, b.key)


def get_latest_version_by_prefix(jira_project: str, pref: str) -> str:
    'Get the greatest Jira version starting with `pref` that has a branch.'

    if isinstance(jira_project, str):
        jira_project = runtime.jira.get_project(jira_project)

    if not pref.endswith('.'):
        pref += '.'

    versions = sorted([
        Version(v.name) for v in jira_project.versions if v.name.startswith(pref)
        and getattr(jira_project.get_version_details(v.name), 'branch', None)
    ])
    return str(versions[-1]) if versions else None
