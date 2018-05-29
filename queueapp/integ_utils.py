from integlib import common_defs
from integlib.jenkins import BuildNoLongerQueued
from integlib.runtime import runtime


def issue_running_or_pending(issue_key: str) -> bool:
    upstream_job = runtime.jenkins.get_job(common_defs.UPSTREAM_JOB)

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
