import { Dropbox } from 'dropbox'

export class ClientStorage {
    db: Dropbox

    constructor(accessToken: string) {
        this.db = new Dropbox({ accessToken })
    }
}
