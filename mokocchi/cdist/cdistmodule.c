#include <Python.h>
#include <math.h>

static PyObject *cdist(PyObject *self, PyObject *args) {
    long r, g, b, r2, g2, b2;
    if (PyArg_ParseTuple(args, "(lll)(lll)", &r, &g, &b, &r2, &g2, &b2)) {
        double ravg = (r + r2) / 2.0;
        r -= r2;
        g -= g2;
        b -= b2;
        long rv = (long) sqrt((512 + ravg) * r * r / 256.0 +
                (4 * g * g) + (767 - ravg) * b * b / 256.0);
        return Py_BuildValue("l", rv);
    }
    return NULL;
}

static PyMethodDef methods[] = {
    {"cdist", cdist, 1, "Colour distance function."},
    {NULL, NULL, 0, NULL},
};

PyMODINIT_FUNC initcdist() {
    Py_InitModule("cdist", methods);
}
