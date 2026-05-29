import { setStyle, add, remove, display, inner } from '../../dom'
import { core } from '../../core'
import { elements, resize } from './learning'
import { setQuestion, data as learningData } from './preparation'
import { checked, storageNames } from '@/storage'
import { endSession, init as engineInit } from '../../engine/run'
import { memoAnswers } from '@/queries/statistics/memoAnswers'
import { memoLogs } from '@/queries/statistics/memoLogs'

export const start = async () => {
    await core.store.set(storageNames.sessionStarted, checked.yes)
    setStyle(elements.sheet, 'opacity', `0`)
    const vv = window.visualViewport as VisualViewport
    resize(vv.width, vv.height)

    inner(elements.startEndBtn, 'Zakończ')
    setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_4_color)')
    remove(elements.startEndBtn, 'click', start)
    add(elements.startEndBtn, 'click', end)

    await engineInit()
    setTimeout(() => {
        display(elements.sheet, 'block')
        setQuestion()
    }, 500)
}

export const end = async () => {
    await core.store.set(storageNames.sessionStarted, checked.no)
    display(elements.sheet, 'none')
    const vv = window.visualViewport as VisualViewport
    resize(vv.width, vv.height)

    inner(elements.startEndBtn, 'Rozpocznij')
    setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_color)')
    remove(elements.startEndBtn, 'click', end)
    add(elements.startEndBtn, 'click', start)

    memoAnswers()
    memoLogs()

    endSession()
    learningData.answers.origin = null
}