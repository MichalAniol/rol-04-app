(function () {
    // @ts-ignore
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
    // @ts-ignore
    axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
    // @ts-ignore
    axios.defaults.withCredentials = true


    getStorage().then(async (store) => {
        core.store = store
        const testDb = idb('test')
        core.idbTest = testDb

        setConsole()

        serviceWorker()

        // const testsDb = await dataBase.tests('bbb')
        // await testsDb.set('tt', 'my===Test')

        // const testData = await testsDb.get('tt')
        // console.log('%c >>> testData:', 'background: #ffcc00; color: #003300', testData)




        initAndGetData()
    })

}())