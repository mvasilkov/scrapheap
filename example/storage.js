(function () {
    const cs = new ClientStorage('file.json', {
        clientId: 'pcoqafxh1ze092a',
        accessToken: localStorage.getItem('access_token'),
        saveAccessToken: accessToken => {
            localStorage.setItem('access_token', accessToken)
        },
    })
    cs.authenticated().then(authenticated => {
        console.log(authenticated)
    })
})()
