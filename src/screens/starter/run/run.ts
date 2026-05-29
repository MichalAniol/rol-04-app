import { waitFor } from '../../../utils/waitFor'
import { data } from '../../../engine/params'
import { core } from '../../../core'
import { memoAnswers } from '../../../queries/statistics/memoAnswers'
import { memoLogs } from '../../../queries/statistics/memoLogs'
import { init as userInit } from './user'
import { check } from './data'
import { checked, storageNames } from '../../../storage'
import { resize } from '../../learning/learning'

export const run = async () => {
    waitFor(() => data.sume !== 0, async () => {
        const started = await core.store.get(storageNames.sessionStarted)
        if (started === checked.yes) {
            await memoAnswers()
            await memoLogs()
            await core.store.set(storageNames.sessionStarted, checked.no)

            const vv = window.visualViewport as VisualViewport
            resize(vv.width, vv.height)
        }
    })()

    await userInit(check)
}
