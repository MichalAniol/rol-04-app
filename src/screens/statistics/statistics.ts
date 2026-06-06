import { add, byId, getPx, remove, setStyle } from '../../dom'
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
    btnOne: HTMLButtonElement
    btnThree: HTMLButtonElement
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
    elements.btnOne = byId('statistics-visualization-type-one') as HTMLButtonElement
    elements.btnThree = byId('statistics-visualization-type-three') as HTMLButtonElement
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

const activeBtn = (upToThree: boolean) => {
    if (upToThree) {
        setStyle(elements.btnThree, 'backgroundColor', 'var(--mine_color)')
        setStyle(elements.btnOne, 'backgroundColor', 'var(--mine_5_color)')
    } else {
        setStyle(elements.btnThree, 'backgroundColor', 'var(--mine_5_color)')
        setStyle(elements.btnOne, 'backgroundColor', 'var(--mine_color)')
    }
}

const showResults = () => {
    waitFor(() => data.monitor.size !== 0, cells)()
    waitFor(() => data.monitor.size !== 0, setData)()
}

const btnOneClick = () => {
    core.store.set(storageNames.learningVisualizationType, learningType.upToOne)
    activeBtn(false)
    showResults()
}

const btnThreeClick = () => {
    core.store.set(storageNames.learningVisualizationType, learningType.upToThree)
    activeBtn(true)
    showResults()
}

export const active = () => {
    add(elements.btnOne, 'click', btnOneClick)
    add(elements.btnThree, 'click', btnThreeClick)

    showResults()
    mouseActive()
}

export const deactivate = () => {
    remove(elements.btnOne, 'click', btnOneClick)
    remove(elements.btnThree, 'click', btnThreeClick)

    mouseDeactivate()
}

export const firstUse = () => {
    const learningVisualizationType = core.store.get(storageNames.learningVisualizationType)
    activeBtn(learningVisualizationType === learningType.upToThree)

    init()
    const vv = visualViewport as VisualViewport
    resize(vv.width, vv.height)
    cells()
}
