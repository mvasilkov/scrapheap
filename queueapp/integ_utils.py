from integlib import common_defs
from integlib.jenkins import BuildNoLongerQueued
from integlib.runtime import runtime

IGNORED_ISSUES = frozenset(common_defs.EXCLUDED_INTEG_ISSUES)


def issue_running_or_pending(issue_key: str, jenkins_job: str = common_defs.UPSTREAM_JOB) -> bool:
    upstream_job = runtime.jenkins.get_job(jenkins_job)

    for build in upstream_job.get_queued_builds():
        try:
            issue = build.get_params().get('ISSUE')
            if issue_key == issue:
                return True
        except BuildNoLongerQueued:
            continue

    for build in upstream_job.get_builds():
        if build.is_running():
            issue = build.get_params().get('ISSUE')
            if issue_key == issue:
                return True

    return False
