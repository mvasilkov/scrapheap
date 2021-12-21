'use strict'

const base64url = require('base64url')
const { deflateAsync } = require('@gfx/zopfli')
const jwt = require('jsonwebtoken')
const pako = require('pako')
const { PEM, kdf } = require('balkans/nodejs_crypto')

const sk = kdf('zjwt' + Math.floor(Math.random() * 256))

function zip(props) {
    const jwtString = jwt.sign(props, PEM.encodePrivateKey(sk), { algorithm: 'ES256' })
    const parts = jwtString.split('.')
    parts.forEach(part => {
        const b = base64url.toBuffer(part)
        /*
        const z = Buffer.from(pako.deflateRaw(b, {
            level: 9,
            memLevel: 9,
        }))
        */
        deflateAsync(b, {}).then(z => {
            z = Buffer.from(z)
            console.log(`${b.length}: ${b.toString('hex')}`)
            console.log(`${z.length}: ${z.toString('hex')}\n`)
        })
    })
}

zip({
    docs: ['https://nodejs.org/api/buffer.html'],
    type: 'text/html',
    size: 285162,
    check: base64url.encode('46f3b8e44906763ae4c418f631a76ac605a72d9254cf7b6da92bfe829012c27d', 'hex'),
})
