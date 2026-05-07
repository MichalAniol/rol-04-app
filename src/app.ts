interface ModulesT {
    init?: () => void;
    resize?: () => void;
    active?: () => void;
    deactivate?: () => void;
}

(function () {
    // @ts-ignore
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
    // @ts-ignore
    axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
    // @ts-ignore
    axios.defaults.withCredentials = true

    const modules = [
        ...tab.screens,
        tab,
        modal
    ] as ModulesT[]

    getStorage().then(async (store) => {
        core.store = store

        core.idb.questions = idb<QuestionDbSchemaT>('questions')
        core.idb.images = idb<ImageDbSchemaT>('images')

        document.addEventListener("DOMContentLoaded", () => {
            controllers.initKeys()

            modules.forEach(m => { if (m.init) m.init() })

            const resize = utils.resize()
            modules.forEach(m => { if (m.resize) { resize.add(m.resize) } })

            resize.run()

            setTimeout(starter.run, 300)

            // tests.errorModal()
            // settings.active()



            setTimeout(() => {
                tab.getGoTo(0)()
            }, 100)
        })


        setConsole()
        serviceWorker()
    })

}())