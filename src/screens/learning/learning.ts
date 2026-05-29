namespace learning {
    type ElementsT = {
        startEnd: HTMLElement | null
        startEndBtn: HTMLButtonElement | null
        sheet: HTMLElement | null
        measure: HTMLElement | null
        imgBig: HTMLElement | null
        info: HTMLElement | null
        separator: HTMLElement | null
        question: HTMLElement | null
        img: HTMLElement | null
        answers: HTMLElement[] | null
        answersFields: HTMLElement[] | null
        checkbox: HTMLInputElement[] | null
        confirm: HTMLButtonElement | null
        bottom: HTMLElement | null
        drawImage: {
            init: (canvas: HTMLCanvasElement, fitCanvas: HTMLCanvasElement) => void;
            setWidth: (width: number) => number;
            draw: (source: Blob | string) => Promise<void>;
        } | null
    }

    const { byId, byQueryAll, setStyle, add, remove, display, getPx } = dom

    export const elements: ElementsT = {
        startEnd: null,
        startEndBtn: null,
        sheet: null,
        measure: null,
        imgBig: null,
        info: null,
        separator: null,
        question: null,
        img: null,
        answers: null,
        answersFields: null,
        checkbox: null,
        confirm: null,
        bottom: null,
        drawImage: null,
    }

    export const init = () => {
        elements.startEnd = byId('learning-start-end') as HTMLElement
        elements.startEndBtn = byId('learning-start-end-btn') as HTMLButtonElement
        elements.sheet = byId('learning-sheet') as HTMLElement
        elements.measure = byId('learning-measure') as HTMLElement
        elements.imgBig = byId('learning-img-big') as HTMLElement
        elements.info = byId('learning-question-info') as HTMLElement
        elements.separator = byId('learning-sheet-separator') as HTMLElement
        elements.question = byId('question') as HTMLElement
        elements.img = byId('learning-img') as HTMLElement
        elements.answers = byQueryAll('.answer p') as unknown as HTMLElement[]
        elements.answersFields = byQueryAll('.answer') as unknown as HTMLElement[]
        elements.checkbox = byQueryAll('.answer input') as unknown as HTMLInputElement[]
        elements.checkbox.forEach(c => c.checked = false)
        elements.confirm = byId('learning-confirm-btn') as HTMLButtonElement
        elements.bottom = byId('learning-bottom-separator') as HTMLButtonElement

        elements.drawImage = utils.drawImage()
        const canvas = byId('learning-img-big-canvas') as HTMLCanvasElement
        const fitCanvas = byId('learning-img-canvas') as HTMLCanvasElement

        elements.drawImage.init(canvas, fitCanvas)

        utils.areNotNull(elements, ['screens', 'learning'])

        display(elements.sheet, 'none')
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
            preparation.setSheetHight()
        } else {
            setStyle(elements.sheet, 'height', `calc(${getPx(h - LOW_START_END_BTN - menuH)})`)
            setStyle(elements.startEnd, 'height', getPx(h - 30 - menuH - 20))
            setStyle(elements.startEndBtn, 'padding', '24px 0')
        }
    }

    const showBigImg = () => display(elements.imgBig, 'flex')

    const hideBigImg = () => display(elements.imgBig, 'none')

    export const active = () => {
        elements.answersFields.forEach((a, i) => add(a, 'click', evaluation.mark(i)))
        const started = core.store.get(storageNames.sessionStarted)
        add(elements.startEndBtn, 'click', started === checked.yes ? startEnd.end : startEnd.start)
        add(elements.confirm, 'click', evaluation.confirmClick)

        add(elements.img, 'click', showBigImg)
        add(elements.imgBig, 'click', hideBigImg)
    }

    export const deactivate = () => {
        elements.answersFields.forEach((a, i) => remove(a, 'click', evaluation.mark(i)))
        remove(elements.startEndBtn, 'click', startEnd.start)
        remove(elements.startEndBtn, 'click', startEnd.end)
        remove(elements.confirm, 'click', evaluation.confirmClick)

        remove(elements.img, 'click', showBigImg)
        remove(elements.imgBig, 'click', hideBigImg)
    }
}