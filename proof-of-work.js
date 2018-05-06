import jwtDecode from 'jwt-decode'

/* Size in bytes */
const SIZE_NONCE = 4 // uint32_t
const SIZE_SALT = 12 // ObjectId
const SIZE_N = 1

/* Offset in bytes */
const OFFSET_NONCE = 0
const OFFSET_SALT = OFFSET_NONCE + SIZE_NONCE + 1
const OFFSET_N = OFFSET_SALT + SIZE_SALT + 1

export function solve(token, contents, done) {
    const decoded = jwtDecode(token)

    // nonce : salt : n : contents
    const buf = stringToUTF8(['nonc', 'decoded.salt', 'n', cleanupCRLF(contents)].join('\t'))
    buf.set(decoded.salt.match(/.{2}/g).map(a => parseInt(a, 16)), OFFSET_SALT)

    const pbuf = new DataView(buf.buffer)
    pbuf.setUint8(OFFSET_N, decoded.n)

    let nonce = 0
    compute()

    function compute() {
        pbuf.setUint32(OFFSET_NONCE, nonce, false)
        crypto.subtle.digest('SHA-256', buf).then(check)
    }

    function check(sha256sum) {
        sha256sum = new DataView(sha256sum)

        let k = 0
        for (let p = 0; p < 32; p += 4) {
            const a = sha256sum.getUint32(p, false)
            if (a == 0) {
                k += 32
                continue
            }
            k += 32 - Math.floor(Math.log2(a) + 1)
            break
        }

        if (k >= decoded.n) {
            done(nonce)
            return
        }
        ++nonce
        compute()
    }
}

function stringToUTF8(a) {
    return new TextEncoder('utf-8').encode(a)
}

function cleanupCRLF(a) {
    return a.replace(/\r\n/g, '\n')
}
