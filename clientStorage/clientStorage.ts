import { Dropbox } from 'dropbox'

interface ICSOptions {
    accessToken?: string,
    clientId?: string,
}

export class ClientStorage {
    readonly db: Dropbox

    constructor(path: string, options: ICSOptions) {
        const { accessToken, clientId } = options
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
