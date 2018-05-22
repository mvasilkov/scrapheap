const JIRA_PREFIX = 'https://jira.infinidat.com/browse/'

let issueLinks = document.querySelectorAll('a.issue:not([src])')
issueLinks = Array.prototype.slice.call(issueLinks)
issueLinks.forEach(a => {
    a.href = JIRA_PREFIX + a.textContent
})
