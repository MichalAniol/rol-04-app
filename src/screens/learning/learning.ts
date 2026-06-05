import { byId, byQueryAll, setStyle, add, remove, display, getPx, boundRect } from '../../dom'
import { data, setSheetHight } from './preparation'
import { mark, confirmClick } from './evaluation'
import * as startEnd from './startEnd'
import { start, end } from './startEnd'
import { core } from '../../core'
import { areNotNull } from '../../utils/isNotNull'
import { drawImage } from '../../utils/drawImage'
import { checked, storageNames } from '@/storage'

type ElementsT = {
    results: HTMLElement
    time: HTMLElement
    mediocreTime: HTMLElement
    all: HTMLElement
    good: HTMLElement
    bad: HTMLElement

    startEnd: HTMLElement
    startEndBtn: HTMLButtonElement

    sheet: HTMLElement
    measure: HTMLElement
    imgBig: HTMLElement
    info: HTMLElement
    history: HTMLElement
    separator: HTMLElement
    question: HTMLElement
    img: HTMLElement
    answers: HTMLElement[]
    answersFields: HTMLElement[]
    checkbox: HTMLInputElement[]
    confirm: HTMLButtonElement
    bottom: HTMLElement
    drawImage: {
        init: (canvas: HTMLCanvasElement, fitCanvas: HTMLCanvasElement) => void;
        setWidth: (width: number) => number;
        draw: (source: Blob | string) => Promise<void>;
    }
}

export const elements = {} as ElementsT

export const init = () => {
    elements.results = byId('learning-session-results') as HTMLElement
    elements.time = byId('learning-session-table-time') as HTMLElement
    elements.mediocreTime = byId('learning-session-table-mediocre-time') as HTMLElement
    elements.all = byId('learning-session-table-all') as HTMLElement
    elements.good = byId('learning-session-table-good') as HTMLElement
    elements.bad = byId('learning-session-table-bad') as HTMLElement

    elements.startEnd = byId('learning-start-end') as HTMLElement
    elements.startEndBtn = byId('learning-start-end-btn') as HTMLButtonElement

    elements.sheet = byId('learning-sheet') as HTMLElement
    elements.measure = byId('learning-measure') as HTMLElement
    elements.imgBig = byId('learning-img-big') as HTMLElement
    elements.info = byId('learning-question-info') as HTMLElement
    elements.history = byId('learning-question-history') as HTMLElement
    elements.separator = byId('learning-sheet-separator') as HTMLElement
    elements.question = byId('question') as HTMLElement
    elements.img = byId('learning-img') as HTMLElement
    elements.answers = byQueryAll('.answer p') as unknown as HTMLElement[]
    elements.answersFields = byQueryAll('.answer') as unknown as HTMLElement[]
    elements.checkbox = byQueryAll('.answer input') as unknown as HTMLInputElement[]
    elements.checkbox.forEach(c => c.checked = false)
    elements.confirm = byId('learning-confirm-btn') as HTMLButtonElement
    elements.bottom = byId('learning-bottom-separator') as HTMLButtonElement

    elements.drawImage = drawImage()
    const canvas = byId('learning-img-big-canvas') as HTMLCanvasElement
    const fitCanvas = byId('learning-img-canvas') as HTMLCanvasElement

    elements.drawImage.init(canvas, fitCanvas)

    areNotNull(elements, ['screens', 'learning'])

    display(elements.sheet, 'none')
    startEnd.init()
}

const LOW_START_END_BTN = 12 + 28 + 12
// const HIGH_START_END_BTN = 24 + 28 + 24

export const resize = (w: number, h: number) => {
    const menuH = core.isMobile ? (121 / 701) * w : 0
    data.tabH = h - 30 - menuH - 20
    const tabW = w - (core.isMobile ? 0 : 200)
    setStyle(elements.imgBig, 'height', getPx(h))
    setStyle(elements.imgBig, 'width', getPx(tabW))
    setStyle(elements.imgBig, 'left', getPx(core.isMobile ? 0 : 200))
    setStyle(elements.bottom, 'height', getPx(menuH))

    elements.drawImage.setWidth(tabW - 80)

    const started = core.store.get(storageNames.sessionStarted)
    if (started === checked.yes) {
        setStyle(elements.startEnd, 'height', getPx(LOW_START_END_BTN))
        setStyle(elements.startEndBtn, 'padding', '12px 0')
        setSheetHight()
    } else {
        setTimeout(() => {
            const resultHeight = boundRect(elements.results).height
            setStyle(elements.startEnd, 'height', getPx(h - 30 - menuH - 20 - resultHeight))
        }, 200)

        setStyle(elements.sheet, 'height', `calc(${getPx(h - LOW_START_END_BTN - menuH)})`)
        setStyle(elements.startEndBtn, 'padding', '24px 0')
    }
}

const showBigImg = () => display(elements.imgBig, 'flex')

const hideBigImg = () => display(elements.imgBig, 'none')

export const active = () => {
    elements.answersFields.forEach((a, i) => add(a, 'click', mark(i)))
    const started = core.store.get(storageNames.sessionStarted)
    add(elements.startEndBtn, 'click', started === checked.yes ? end : start)
    add(elements.confirm, 'click', confirmClick)

    add(elements.img, 'click', showBigImg)
    add(elements.imgBig, 'click', hideBigImg)
}

export const deactivate = () => {
    elements.answersFields.forEach((a, i) => remove(a, 'click', mark(i)))
    remove(elements.startEndBtn, 'click', start)
    remove(elements.startEndBtn, 'click', end)
    remove(elements.confirm, 'click', confirmClick)

    remove(elements.img, 'click', showBigImg)
    remove(elements.imgBig, 'click', hideBigImg)
}