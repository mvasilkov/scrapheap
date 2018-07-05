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

const MODE_OVERWRITE: DropboxTypes.files.WriteModeOverwrite = { '.tag': 'overwrite' }

interface IOptions {
    accessToken?: string,
    clientId?: string,
    saveAccessToken?: (accessToken: string) => void,
}

export class ClientStorage {
    readonly db: Dropbox
    readonly path: string

    constructor(path: string, options: IOptions) {
        let { accessToken } = options
        const { clientId, saveAccessToken } = options

        if (accessToken == null) {
            if (accessToken = queryArgs()['access_token']) {
                if (saveAccessToken) saveAccessToken(accessToken)
            }
        }

        this.db = new Dropbox({ accessToken, clientId })
        this.path = path.startsWith('/') ? path : `/${path}`
    }

    authenticated(): Promise<boolean> {
        if (this.db.getAccessToken()) {
            return this.db.usersGetSpaceUsage(undefined)
                .then(usage => true)
                .catch(err => false)
        }
        return Promise.resolve(false)
    }

    authenticationUrl(next: string): string {
        return this.db.getAuthenticationUrl(next)
    }

    load(): Promise<string> {
        return new Promise(next => {
            this.db.filesDownload({ path: this.path })
                .then((response: any) => {
                    const reader = new FileReader
                    reader.addEventListener('loadend', () => next(reader.result))
                    reader.readAsText(response.fileBlob, 'utf-8')
                })
                .catch(err => next(''))
        })
    }

    save(contents: string): Promise<boolean> {
        return new Promise(next => {
            this.db.filesUpload({ contents, path: this.path, mode: MODE_OVERWRITE })
                .then(response => next(true))
                .catch(err => next(false))
        })
    }
}
