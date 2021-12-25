from queueapp.utils import run_if_active


def test_run_if_active():
    class A:
        is_active = False
        count = 0

        @run_if_active
        def run(self):
            self.count += 1

    a = A()
    b = A()
    b.is_active = True

    assert a.count == 0
    assert b.count == 0

    a.run()
    b.run()

    assert a.count == 0
    assert b.count == 1

    a.run()
    b.run()

    assert a.count == 0
    assert b.count == 2
