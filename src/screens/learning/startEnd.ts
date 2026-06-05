import { setStyle, add, remove, display, inner } from '../../dom'
import { core } from '../../core'
import { elements, resize } from './learning'
import { setQuestion, data as learningData } from './preparation'
import { checked, SessionDataT, storageNames } from '@/storage'
import { endSession, init as engineInit } from '../../engine/run'
import { memoAnswers } from '@/queries/statistics/memoAnswers'
import { memoLogs } from '@/queries/statistics/memoLogs'

export const sessionData = {
    timeStart: 0,
    time: 0,
    mediocre: 0,
    all: 0,
    good: 0,
    bad: 0,
}

const cleanSessionData = () => {
    sessionData.timeStart = new Date().getTime()
    sessionData.time = 0
    sessionData.mediocre = 0
    sessionData.all = 0
    sessionData.good = 0
    sessionData.bad = 0
}

export const addGood = () => {
    sessionData.all++
    sessionData.good++
}

export const addBad = () => {
    sessionData.all++
    sessionData.bad++
}

const getSessionDataFromMemo = () => {
    const data = core.store.get(storageNames.lastSession) as SessionDataT

    sessionData.time = data.time
    sessionData.mediocre = data.mediocre
    sessionData.all = data.all
    sessionData.good = data.good
    sessionData.bad = data.bad
}

const setSessionDataToMemo = () => {
    if (sessionData.all > 0) {
        core.store.set(storageNames.lastSession, {
            time: sessionData.time,
            mediocre: sessionData.mediocre,
            all: sessionData.all,
            good: sessionData.good,
            bad: sessionData.bad,
        })
    }
}

const formatTimestamp = (timestamp: number) => {
    const totalSeconds = Math.floor(timestamp / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, '0')

    return `${hours}:${pad(minutes)}:${pad(seconds)}`
}

const countTime = () => {
    const now = new Date().getTime()
    sessionData.time = now - sessionData.timeStart

    if (sessionData.all > 0) {
        sessionData.mediocre = sessionData.time / sessionData.all
    }
}

const showSessionData = () => {
    inner(elements.time, formatTimestamp(sessionData.time))
    inner(elements.mediocreTime, sessionData.all > 0 ? formatTimestamp(sessionData.mediocre) : '-')
    inner(elements.all, sessionData.all.toString())
    inner(elements.good, sessionData.good.toString())
    inner(elements.bad, sessionData.bad.toString())
}

export const start = async () => {
    await core.store.set(storageNames.sessionStarted, checked.yes)
    setStyle(elements.sheet, 'opacity', `0`)
    const vv = window.visualViewport as VisualViewport
    resize(vv.width, vv.height)

    display(elements.results, 'none')
    inner(elements.startEndBtn, 'Zakończ')
    setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_4_color)')
    remove(elements.startEndBtn, 'click', start)
    add(elements.startEndBtn, 'click', end)

    cleanSessionData()

    await engineInit()
    setTimeout(() => {
        display(elements.sheet, 'block')
        setQuestion()
        // disable(elements.startEndBtn)
    }, 500)
}

export const end = async () => {
    await core.store.set(storageNames.sessionStarted, checked.no)
    display(elements.sheet, 'none')
    const vv = window.visualViewport as VisualViewport
    resize(vv.width, vv.height)

    display(elements.results, 'block')
    inner(elements.startEndBtn, 'Rozpocznij')
    setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_color)')
    remove(elements.startEndBtn, 'click', end)
    add(elements.startEndBtn, 'click', start)

    if (sessionData.all > 0) {
        countTime()
        showSessionData()
        setSessionDataToMemo()
    } else {
        getSessionDataFromMemo()
        showSessionData()
    }

    memoAnswers()
    memoLogs()

    endSession()
    learningData.answers.origin = null
}

export const init = () => {
    getSessionDataFromMemo()
    showSessionData()
}