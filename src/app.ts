import axios from 'axios'
import { add } from './dom'
import { core } from './core'
import { controllers } from './inputs/keys'
import { idb } from './idb'
import { ModulesT } from './tab/tab'
import * as init from './init/init'
import { AnswersDbSchemaT, ImageDbSchemaT, LogDbSchemaT, QuestionDbSchemaT } from './types'
import { resize as utilsResize } from './utils/resize'
import * as tab from './tab/tab'
import * as modal from './modal/modal'
import { init as engineParamsInit } from './engine/params'
import { getStorage } from './storage'
import { serviceWorker } from './serviceWorker'
import { setConsole } from './console'


(function () {
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
    axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
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
        core.idb.answers = idb<AnswersDbSchemaT>('answers')
        core.idb.logs = idb<LogDbSchemaT>('logs')

        core.info = [
            '1. dodano w ustawieniach przyciski wczytania użytkownika i restart pytań.',
            '2. dodano podsumowanie sesji po jej zakończeniu.',
            '3. przy losowaniu uwzględniono datę ostatniego uzycia pytania - nowsze częściej występują w nowych testach.',
            '4. dodano wizualizację historię odpowiedzi',
        ]

        const domContentLoaded = async () => {
            controllers.initKeys()

            modules.forEach(m => { if (m.init) m.init() })

            const resize = utilsResize()
            modules.forEach(m => { if (m.resize) { resize.add(m.resize) } })

            resize.run()

            await init.init()

            setTimeout(async () => {
                tab.getGoTo(0)()
                await engineParamsInit()
            }, 300)
        }
        add(document, 'DOMContentLoaded', domContentLoaded)

        setConsole()
        await serviceWorker()
    })
}())