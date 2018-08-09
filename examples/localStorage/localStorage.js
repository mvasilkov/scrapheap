(function () {
    const APP_KEY = 'pcoqafxh1ze092a'
    const PAGE_URL = 'http://localhost:8000/examples/localStorage/'

    setState('initializing')
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
            }).catch(err => setState('error'))
        }
        else {
            setState('not-authenticated')
            setAuthLink(storage.authenticationUrl(PAGE_URL))
        }
    })

    function setState(state) {
        [].slice.call(document.getElementsByClassName('state')).forEach(a => {
            a.style.display = a.classList.contains(`state-${state}`) ? 'block' : 'none'
        })
    }
    function setAuthLink(url) {
        document.getElementById('client-storage-auth-link').href = url
    }
})()
