import ms from 'ms'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import AbortController from 'abort-controller'
import readline from 'readline'

interface UserObject {
    type: string
    id: number
    role: string
    name: string
    email: string
    password_digest_version: number
    enabled: boolean
    is_digest_sufficient: boolean
    roles: string[]
}

interface User {
    _cookie: string
    name: string
    roles: string[]
    user_objects: UserObject[]
}

interface ShellResponse {
    session: string
    data: string
}

interface Connection {
    box: string
    user: User
    session: string
}

interface ReadlineEvent {
    sequence: string
    name: string
    ctrl: boolean
    meta: boolean
    shift: boolean
}

function getCookie(headers: string[]): string {
    const a = headers.find(a => a.startsWith('JSESSIONID='))
    if (!a) throw Error('Bad JSESSIONID cookie (1)')
    const b = a.match(/JSESSIONID=(.*?);/)
    if (!b) throw Error('Bad JSESSIONID cookie (2)')
    return b[1]
}

async function login(box: string, username: string, password: string): Promise<User> {
    const response = await fetch(`http://${box}/api/rest/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (response.status != 200) throw Error(`Crows peck at your crops, Giuseppe! (${response.status})`)

    const cookie = getCookie(response.headers.raw()['set-cookie'])
    const json = await response.json()

    return Object.assign({}, json.result, { _cookie: cookie })
}

async function auth(box: string, user: User): Promise<ShellResponse> {
    const authString = encodeURIComponent(JSON.stringify({
        hostname: 'localhost',
        username: user.name,
        roles: user.roles,
        cookie: user._cookie,
    }))

    const par = new URLSearchParams
    par.append('width', '80')
    par.append('height', '24')
    par.append('rooturl', `http://${box}/infinishell?auth-jsessionid=${authString}`)

    const response = await fetch(`http://${box}/infinishell`, {
        method: 'POST',
        // headers: {
        //     'Cookie': user._cookie,
        //     'Referer': `http://${box}/infinishell?auth-jsessionid=${authString}`,
        // },
        body: par,
    })

    if (response.status != 200) throw Error(`Crows peck at your crops, Giuseppe! (${response.status})`)

    return response.json()
}

async function longPolling(con: Connection): Promise<ShellResponse> {
    const par = new URLSearchParams
    par.append('width', '80')
    par.append('height', '24')
    par.append('session', con.session)

    const ab = new AbortController
    const cancel = setTimeout(_ => ab.abort(), ms('30s'))

    const response = await fetch(`http://${con.box}/infinishell`, {
        method: 'POST',
        // headers: { 'Cookie': con.user._cookie },
        body: par,
        signal: ab.signal,
    })

    clearTimeout(cancel)

    if (response.status != 200) throw Error(`Crows peck at your crops, Giuseppe! (${response.status})`)

    return response.json()
}

function encodeInput(key: string) {
    return Buffer.from(key, 'utf8').toString('hex')
}

function sendInput(con: Connection, key: string, event: ReadlineEvent) {
    const par = new URLSearchParams
    par.append('width', '80')
    par.append('height', '24')
    par.append('session', con.session)
    par.append('keys', encodeInput(key))

    fetch(`http://${con.box}/infinishell`, {
        method: 'POST',
        // headers: { 'Cookie': con.user._cookie },
        body: par,
    })
}

export async function run() {
    const box = 'ibox2831'
    const user = await login(box, 'infinidat', '123456')
    console.log('Logged in as user:', JSON.stringify(user, null, 4))

    const { session } = await auth(box, user)
    const con: Connection = {
        box,
        user,
        session,
    }

    if (process.stdin.isTTY)
        process.stdin.setRawMode(true)

    readline.emitKeypressEvents(process.stdin)

    process.stdin.on('keypress', (key, event) => {
        if (event.name == 'c' && event.ctrl) process.exit()
        // console.log('key', key)
        // console.log('event', event)
        sendInput(con, key, event)
    })

    while (true) {
        try {
            const response = await longPolling(con)
            // console.log('Response:', JSON.stringify(response, null, 4))
            process.stdout.write(response.data)
        }
        catch (err) {
            if (err.name == 'AbortError') {
                console.log('Nothing')
            }
        }
    }
}
