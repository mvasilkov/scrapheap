(function () {
    const APP_KEY = 'pcoqafxh1ze092a'
    const PAGE_URL = 'http://localhost:8000/examples/localStorage/'

    const cs = new ClientStorage('file.json', {
        clientId: APP_KEY,
        accessToken: localStorage.getItem('access_token'),
        saveAccessToken: accessToken => {
            localStorage.setItem('access_token', accessToken)
        },
    })
    cs.authenticated().then(authenticated => {
        console.log(authenticated)
        if (authenticated) {
        }
        else {
            setState('not-authenticated')
            setAuthLink(cs.authenticationUrl(PAGE_URL))
        }
    })

    function setState(state) {
        document.getElementById('client-storage').className = `state-${state}`
    }
    function setAuthLink(url) {
        document.getElementById('client-storage-auth-link').href = url
    }
})()
