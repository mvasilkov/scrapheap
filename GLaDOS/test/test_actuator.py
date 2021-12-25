import pytest

from queueapp.models import Queue, Buffer, Issue, JenkinsActuator


@pytest.mark.django_db
def test_exclude_disconnected_issues():
    q = Queue()
    q.save()

    b = Buffer(queue=q)
    b.save()

    Issue(buffer=b, key='FOO-1', props={'fix_versions': ['4.0.0.90', '5.0.0.0']}).save()
    Issue(buffer=b, key='FOO-2', props={'fix_versions': ['4.0.10.0']}).save()
    Issue(buffer=b, key='FOO-3', props={'fix_versions': ['3.0.30.20', '4.0.10.0']}).save()
    Issue(buffer=b, key='FOO-4', props={'fix_versions': ['4.0.10.0']}).save()

    keys = [issue.key for issue in JenkinsActuator.exclude_disconnected_issues(b.ordered_issues)]
    assert (keys == ['FOO-1'])


@pytest.mark.django_db
def test_include_connected_issues():
    q = Queue()
    q.save()

    b = Buffer(queue=q)
    b.save()

    Issue(buffer=b, key='FOO-1', props={'fix_versions': ['5.0.0.0']}).save()
    Issue(buffer=b, key='FOO-2', props={'fix_versions': ['4.0.0.90', '4.0.10.0']}).save()
    Issue(buffer=b, key='FOO-3', props={'fix_versions': ['5.0.0.0', '4.0.10.0']}).save()
    Issue(buffer=b, key='FOO-4', props={'fix_versions': ['4.0.10.0']}).save()

    keys = [issue.key for issue in JenkinsActuator.exclude_disconnected_issues(b.ordered_issues)]
    assert (keys == ['FOO-1', 'FOO-2', 'FOO-3', 'FOO-4'])
