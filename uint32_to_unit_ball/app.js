'use strict'

const MAX_UINT32 = 2 ** 32 - 1

function fun1(n) {
    return (n / MAX_UINT32) * 2 - 1
}

function fun2(n) {
    /* Equals to fun1 */
    return ((n / MAX_UINT32) - 0.5) * 2
}

function fun3(n) {
    /* Best precision */
    return (2 * n - MAX_UINT32) / MAX_UINT32
}

function fun4(n) {
    /* Equals to fun1 */
    return (2 * n) / MAX_UINT32 - 1
}
