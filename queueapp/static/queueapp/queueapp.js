const JIRA_PREFIX = 'https://jira.infinidat.com/browse/'
const JENKINS_URL = 'http://ci.infinidat.com/job/{jenkins_job}/{jenkins_build_id}/console'

function autoLinkThings() {
    // Jira issues
    let issueLinks = document.querySelectorAll('a.issue:not([src])')
    issueLinks = Array.prototype.slice.call(issueLinks)
    issueLinks.forEach(a => {
        a.href = JIRA_PREFIX + a.textContent
    })

    // Jenkins builds
    let jbuildLinks = document.querySelectorAll('a.jbuild:not([src])')
    jbuildLinks = Array.prototype.slice.call(jbuildLinks)
    jbuildLinks.forEach(a => {
        a.href = JENKINS_URL.replace('{jenkins_job}', a.dataset.jenkinsJob)
            .replace('{jenkins_build_id}', a.dataset.jenkinsBuildId)
    })
}

function autoreload(seconds, done) {
    setInterval(function () {
        $('.container').load(location.toString() + ' .container>article', done)
    }, seconds)
}

function pageDown() {
    $('html, body').animate({ scrollTop: $(document).height() }, 300)
}
