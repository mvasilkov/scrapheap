const request = require('request')

function callback(resolve, reject) {
    return function (error, response, body) {
        if (error == null && response.statusCode == 200) {
            let result
            if (typeof response.body == 'string') {
                try {
                    result = JSON.parse(response.body)
                }
                catch (err) {
                    reject()
                }
            }
            else {
                result = response.body
            }
            return resolve(result)
        }
        reject()
    }
}

function auth(api, username, password, client, secret) {
    const reqOptions = {
        url: `${api}/authentication/token`,
        form: {
            grant_type: 'password',
            username,
            password,
            client_id: client,
            client_secret: secret,
        },
    }

    return new Promise(function (resolve, reject) {
        request.post(reqOptions, callback(resolve, reject))
    })
}

function invite(api, access, email, role) {
    const reqOptions = {
        url: `${api}/invites`,
        headers: {
            Authorization: `Bearer ${access}`,
        },
        body: {
            invites: [
                {
                    token: null,
                    email,
                    expires: null,
                    created_by: null,
                    updated_by: null,
                    status: null,
                    role_id: role,
                }
            ]
        },
        json: true,
    }

    return new Promise(function (resolve, reject) {
        request.post(reqOptions, callback(resolve, reject))
    })
}

module.exports.auth = auth
module.exports.invite = invite
