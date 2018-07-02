import { Dropbox } from 'dropbox'

type QueryArgs = { [k: string]: string | undefined }

function queryArgs(): QueryArgs {
    const result: QueryArgs = {}

    location.hash.replace(/^#/, '').split('&')
        .map(a => a.split('='))
        .forEach(([a, ...b]) => {
            result[decodeURIComponent(a)] = decodeURIComponent(b.join('='))
        })

    return result
}

interface IOptions {
    accessToken?: string,
    clientId?: string,
    saveAccessToken?: (accessToken: string) => void,
}

export class ClientStorage {
    readonly db: Dropbox

    constructor(path: string, options: IOptions) {
        let { accessToken } = options
        const { clientId, saveAccessToken } = options

        if (accessToken == null) {
            if (accessToken = queryArgs()['access_token']) {
                if (saveAccessToken) saveAccessToken(accessToken)
            }
        }

        this.db = new Dropbox({ accessToken, clientId })
    }

    authenticated(): Promise<boolean> {
        if (this.db.getAccessToken()) {
            return this.db.usersGetSpaceUsage(undefined)
                .then(usage => true)
                .catch(err => false)
        }
        return Promise.resolve(false)
    }
}
