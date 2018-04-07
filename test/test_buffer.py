import pytest

from queueapp.models import Queue, Buffer, Issue
from queueapp.utils import issue_cmp

# Order by priority
COMPARE_PRIORITY = '''
result = PRIORITIES[a.props['priority']] - PRIORITIES[b.props['priority']]
'''

# Default ordering, but FOO-2 comes first
COMPARE_SELECT_ONE = '''
if a.key == 'FOO-2':
    result = -1
'''


@pytest.mark.django_db
def test_buffer_ordering_nothing():
    q = Queue()
    q.save()

    b = Buffer(queue=q)
    b.save()


@pytest.mark.django_db
def test_buffer_ordering_key():
    q = Queue()
    q.save()

    b = Buffer(queue=q)
    b.save()

    Issue(buffer=b, key='FOO-2').save()
    Issue(buffer=b, key='FOO-1').save()
    Issue(buffer=b, key='FOO-3').save()

    # Default ordering is alphabetically by the issue key
    top_issue = b.get_ordered()
    assert top_issue.key == 'FOO-1'

    # Remove the top issue from the buffer
    top_issue.buffer = None
    top_issue.save()

    # Now the second one is on top
    assert b.get_ordered().key == 'FOO-2'

    assert b.count() == 2
    keys = [issue.key for issue in b.get_ordered(count=2)]
    assert keys == ['FOO-2', 'FOO-3']


@pytest.mark.django_db
def test_buffer_ordering_function():
    q = Queue()
    q.save()

    b = Buffer(queue=q, cmp_function=COMPARE_PRIORITY)
    b.save()

    # Blocker, then Critical, then Major, then Minor, then Trivial
    Issue(buffer=b, key='FOO-1', props={'priority': 'Minor'}).save()
    Issue(buffer=b, key='FOO-2', props={'priority': 'Blocker'}).save()
    Issue(buffer=b, key='FOO-3', props={'priority': 'Minor'}).save()
    Issue(buffer=b, key='FOO-4', props={'priority': 'Critical'}).save()

    assert b.count() == 4
    keys = [issue.key for issue in b.get_ordered(count=4)]
    assert keys == ['FOO-2', 'FOO-4', 'FOO-1', 'FOO-3']


@pytest.mark.django_db
def test_buffer_ordering_select_one():
    q = Queue()
    q.save()

    b = Buffer(queue=q, cmp_function=COMPARE_SELECT_ONE)
    b.save()

    Issue(buffer=b, key='FOO-1').save()
    Issue(buffer=b, key='FOO-2').save()
    Issue(buffer=b, key='FOO-3').save()

    assert b.count == 3
    keys = [issue.key for issue in b.get_ordered(count=3)]
    assert keys == ['FOO-2', 'FOO-1', 'FOO-3']
