import { waitFor } from '../utils/waitFor'
import { data } from '../engine/params'
import { core } from '../core'
import { memoAnswers } from '../queries/statistics/memoAnswers'
import { memoLogs } from '../queries/statistics/memoLogs'
import { init as userInit } from './user'
import { check } from './data'
import { checked, storageNames } from '../storage'
import { resize } from '../screens/learning/learning'
import { getSecure } from '@/queries/secure/secure'

export const getSecureAndCheckData = async () => {
    await getSecure()
    setTimeout(() => check(), 100)
}

export const init = async () => {
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

    await userInit()
}
