(function () {
    const APP_KEY = 'pcoqafxh1ze092a'
    const PAGE_URL = 'http://localhost:8000/examples/localStorage/'

    const storage = new ClientStorage('things.json', {
        clientId: APP_KEY,
        accessToken: localStorage.getItem('access_token'),
        saveAccessToken: accessToken => {
            localStorage.setItem('access_token', accessToken)
        },
    })
    storage.authenticated().then(authenticated => {
        if (authenticated) {
            setState('downloading')
            storage.load().then(result => {
                let obj = { count: 0 }
                if (result) {
                    obj = JSON.parse(result)
                    ++obj.count
                }
                setState('uploading')
                storage.save(JSON.stringify(obj)).then(saved => {
                    if (saved) {
                        setState('success')
                    }
                    else {
                        setState('error')
                    }
                })
            })
        }
        else {
            setState('not-authenticated')
            setAuthLink(storage.authenticationUrl(PAGE_URL))
        }
    })

    function setState(state) {
        document.getElementById('client-storage').className = `state-${state}`
    }
    function setAuthLink(url) {
        document.getElementById('client-storage-auth-link').href = url
    }
})()
