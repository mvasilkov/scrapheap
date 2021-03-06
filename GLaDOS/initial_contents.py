#!/usr/bin/env python
from datetime import timedelta

from central_core import load_django

from queueapp.models import Queue, Buffer, JiraPoller, AutoFilter, JenkinsActuator

queue = Queue(name='Infinibox Integration Queue', is_active=True)
queue.save()

b1func = '''
# Order by version ASC, then priority
# Blocker, then Critical, then Major, then Minor, then Trivial
result = compare_issues_infinidat(a, b)
'''
b1 = Buffer(name='Before pre_auto', queue=queue, cmp_function=b1func.lstrip())
b1.save()

b2func = b1func
b2 = Buffer(name='Issues', queue=queue, cmp_function=b2func.lstrip())
b2.save()

query = ('project = Infinibox and status = Integrating and fixVersion is not empty and '
         '(labels not in (integ-failed-sanity) or labels is empty)')
jira_poller = JiraPoller(
    name='Jira Poller', queue=queue, to_buffer=b1, interval=timedelta(minutes=2), query=query)
jira_poller.is_active = True
jira_poller.save()

auto_filter = AutoFilter(name='Filter running pre_auto', queue=queue, from_buffer=b1, to_buffer=b2)
auto_filter.is_active = True
auto_filter.save()

jenkins_actuator = JenkinsActuator(
    name='Jenkins Actuator', queue=queue, from_buffer=b2, project_name='Le fake job for testing')
jenkins_actuator.is_active = True
jenkins_actuator.save()
