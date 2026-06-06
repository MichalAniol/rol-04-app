import { add, byId, getPx, inner, remove, setStyle } from '../../dom'
import { data } from './data'
import { resize as drawResize, init as drawInit, cells } from './draw'
import { setData } from './table'
import { active as mouseActive, deactivate as mouseDeactivate } from './mouse'
import { areNotNull } from '../../utils/isNotNull'
import { waitFor } from '../../utils/waitFor'
import { data as engineData, updateAnswers } from '../../engine/params'
import { setMonitorLegend } from './legend'
import { core } from '../../core'
import { learningType, storageNames } from '@/storage'

type ElementsT = {
    type: HTMLElement
    sheet: HTMLElement
    monitor: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    legend: HTMLElement
    table: HTMLElement
    bottom: HTMLElement
    tooltip: HTMLElement
}

export const elements = {} as ElementsT

export const init = async () => {
    elements.type = byId('statistics-learning-type') as HTMLElement
    elements.sheet = byId('statistics-sheet') as HTMLElement
    elements.monitor = byId('statistics-monitor') as HTMLCanvasElement
    elements.ctx = elements.monitor.getContext('2d') as CanvasRenderingContext2D
    elements.table = byId('statistics-table') as HTMLElement
    elements.legend = byId('statistics-colors-legend') as HTMLElement
    elements.bottom = byId('statistics-bottom') as HTMLElement
    elements.tooltip = byId('tooltip') as HTMLElement

    areNotNull(elements, ['screens', 'drawing'])

    await updateAnswers()
    drawInit()

    waitFor(() => engineData.answers.length !== 0 && data.steps.used.length !== 0 && elements.legend !== null, setMonitorLegend)()
}

export const resize = (w: number, h: number) => {
    data.monitor.width = Math.min((w - 60 - (core.isMobile ? 0 : 220)), 660)

    const menuH = core.isMobile ? (121 / 701) * w : 0
    setStyle(elements.sheet as HTMLElement, 'height', `calc(${getPx(h)})`)
    setStyle(elements.bottom as HTMLElement, 'height', getPx(menuH))

    drawResize(w, h)
}

const setTestTypeName = () => {
    const learningTypeMemo = core.store.get(storageNames.learningType)
    if (learningTypeMemo === learningType.upToThree) {
        inner(elements.type, 'do trzech dobrych odpowiedzi')
    } else {
        inner(elements.type, 'do jednej dobrej odpowiedzi')
    }
}

const showResults = () => {
    waitFor(() => data.monitor.size !== 0, cells)()
    waitFor(() => data.monitor.size !== 0, setData)()
}

export const active = () => {
    setTestTypeName()
    showResults()
    mouseActive()
}

export const deactivate = () => {
    mouseDeactivate()
}

export const firstUse = () => {
    init()
    const vv = visualViewport as VisualViewport
    resize(vv.width, vv.height)
    cells()
}
