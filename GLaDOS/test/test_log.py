from itertools import islice

import pytest

from queueapp.models import Queue, Log


@pytest.mark.django_db
def test_truncate_logs():
    q = Queue()
    q.save()

    batch_size = 256
    logs = (Log(queue=q, message=str(i)) for i in range(1234))
    while True:
        batch = list(islice(logs, batch_size))
        if not batch:
            break
        Log.objects.bulk_create(batch, batch_size)

    assert q.logs.count() == 1234

    Log.truncate_logs(q)

    assert q.logs.count() == 999

    last_log = q.logs.order_by('-pk').first()
    oldest_log = q.logs.order_by('-pk').last()

    assert last_log.message == '1233'
    assert oldest_log.message == '235'
