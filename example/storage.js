(function () {
    const cs = new ClientStorage('file.json', { clientId: 'pcoqafxh1ze092a' })
    cs.authenticated().then(authenticated => {
        console.log(authenticated)
    })
})()
