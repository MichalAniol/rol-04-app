import { Axios } from 'axios'
import * as dom from './dom'


interface ModulesT {
    init?: () => void;
    resize?: () => void;
    active?: () => void;
    deactivate?: () => void;
}

(function () {
    // @ts-ignore
    Axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
    // @ts-ignore
    Axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
    // @ts-ignore
    Axios.defaults.withCredentials = true

    const { byId, inner } = dom.dom

    const modules = [
        ...tab.screens,
        tab,
        modal
    ] as ModulesT[]

    getStorage().then(async (store) => {
        core.store = store

        core.idb.questions = idb<QuestionDbSchemaT>('questions')
        core.idb.images = idb<ImageDbSchemaT>('images')
        core.idb.answers = idb<AnswersDbSchemaT>('answers')
        core.idb.statistics = idb<any>('statistics')
        core.idb.logs = idb<any>('logs')

        document.addEventListener("DOMContentLoaded", async () => {
            controllers.initKeys()

            modules.forEach(m => { if (m.init) m.init() })

            const resize = utils.resize()
            modules.forEach(m => { if (m.resize) { resize.add(m.resize) } })

            resize.run()

            // setTimeout(starter.run, 300)
            await starter.run()

            // tests.errorModal()
            // settings.active()
            const v = byId('settings-version-id') as HTMLElement
            inner(v, '--1.0.25--')

            setTimeout(async () => {
                tab.getGoTo(0)()
                await engine.params.init()
            }, 300)
        })

        setConsole()
        await serviceWorker()
    })
}())