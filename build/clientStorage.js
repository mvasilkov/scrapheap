"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dropbox_1 = require("dropbox");
function queryArgs() {
    const result = {};
    location.hash.replace(/^#/, '').split('&')
        .map(a => a.split('='))
        .forEach(([a, ...b]) => {
        result[decodeURIComponent(a)] = decodeURIComponent(b.join('='));
    });
    return result;
}
function pathNotFound(err) {
    if (typeof err == 'string') {
        err = JSON.parse(err).error;
    }
    return err['.tag'] == 'path' && err.path['.tag'] == 'not_found';
}
const MODE_OVERWRITE = { '.tag': 'overwrite' };
class ClientStorage {
    constructor(path, options) {
        let { accessToken } = options;
        const { clientId, saveAccessToken } = options;
        if (accessToken == null) {
            if (accessToken = queryArgs()['access_token']) {
                if (saveAccessToken)
                    saveAccessToken(accessToken);
            }
        }
        this.db = new dropbox_1.Dropbox({ accessToken, clientId });
        this.path = path.startsWith('/') ? path : `/${path}`;
    }
    authenticated() {
        if (this.db.getAccessToken()) {
            return this.db.usersGetSpaceUsage(undefined)
                .then(usage => true)
                .catch(err => false);
        }
        return Promise.resolve(false);
    }
    authenticationUrl(next) {
        return this.db.getAuthenticationUrl(next);
    }
    load(defaultContents) {
        return new Promise((next, loadingError) => {
            this.db.filesDownload({ path: this.path })
                .then((response) => {
                const reader = new FileReader;
                reader.addEventListener('loadend', () => next(reader.result));
                reader.readAsText(response.fileBlob, 'utf-8');
            })
                .catch(err => {
                if (pathNotFound(err.error))
                    next(defaultContents || '');
                else
                    loadingError(err);
            });
        });
    }
    save(contents) {
        return new Promise(next => {
            this.db.filesUpload({ contents, path: this.path, mode: MODE_OVERWRITE })
                .then(response => next(true))
                .catch(err => next(false));
        });
    }
}
exports.ClientStorage = ClientStorage;
