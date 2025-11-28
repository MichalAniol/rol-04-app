(function () {
    // @ts-ignore
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
    // @ts-ignore
    axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
    // @ts-ignore
    axios.defaults.withCredentials = true


    getStorage().then(async (store) => {
        core.store = store

        // const testDb = idb('test')
        // core.idbTest = testDb

        document.addEventListener("DOMContentLoaded", () => {
            controllers.initKeys()
            settings.init()
            starter.init()
            learning.init()
            tab.init()
            modal.init()

            const resize = utils.resize()
            resize.add(tab.resize)
            resize.add(modal.resize)
            resize.run()

            // setTimeout(starter.run, 300)

            // tests.errorModal()

            // setTimeout(tab.getGoTo(2), 100)
        })




        setConsole()

        serviceWorker()

        // const testsDb = await dataBase.tests('bbb')
        // await testsDb.set('tt', 'my===Test')

        // const testData = await testsDb.get('tt')
        // console.log('%c >>> testData:', 'background: #ffcc00; color: #003300', testData)



    })

}())