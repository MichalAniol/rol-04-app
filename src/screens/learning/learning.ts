namespace learning {
    type ElementsT = {
        startEnd: HTMLElement | null
        startEndBtn: HTMLElement | null
        sheet: HTMLElement | null
        info: HTMLElement | null
        separator: HTMLElement | null
        question: HTMLElement | null
        answers: HTMLElement[] | null
        answersField: HTMLElement[] | null
        checkbox: HTMLInputElement[] | null
        confirm: HTMLElement | null
    }

    const { byId, byQueryAll, setStyle, add, remove, display, getPx, inner } = dom

    const elements: ElementsT = {
        startEnd: null,
        startEndBtn: null,
        sheet: null,
        info: null,
        separator: null,
        question: null,
        answers: null,
        answersField: null,
        checkbox: null,
        confirm: null,
    }

    type DataT = {
        mark: number,
        started: boolean,
        tabH: number,
        answers: {
            origin: LearningT | null,
            shuffled: {
                content: string,
                correct: boolean,
            }[]
        }
    }

    const data: DataT = {
        mark: 0,
        started: false,
        tabH: 0,
        answers: {
            origin: null,
            shuffled: [],
        }
    }

    const mark = (num: number) => () => {
        data.mark = num
        elements.checkbox.forEach((a, i) => a.checked = (i === num))
        elements.answersField.forEach((a, i) => i === num ? setStyle(a, 'border', '2px solid var(--mine_color)') : setStyle(a, 'border', '2px solid transparent'))
    }

    export const init = () => {
        elements.startEnd = byId('learning-start-end') as HTMLElement
        elements.startEndBtn = byId('learning-start-end-btn') as HTMLElement
        elements.sheet = byId('learning-sheet') as HTMLElement
        elements.info = byId('learning-question-info') as HTMLElement
        elements.separator = byId('learning-sheet-separator') as HTMLElement
        elements.question = byId('question') as HTMLElement
        elements.answers = byQueryAll('.answer p') as unknown as HTMLElement[]
        elements.answersField = byQueryAll('.answer') as unknown as HTMLElement[]
        elements.checkbox = byQueryAll('.answer input') as unknown as HTMLInputElement[]
        elements.checkbox.forEach(c => c.checked = false)
        elements.confirm = byId('learning-confirm-btn') as HTMLElement
        utils.areNotNull(elements, ['screens', 'learning'])

        display(elements.sheet, 'none')
    }

    const LOW_START_END_BTN = 12 + 28 + 12
    const HIGH_START_END_BTN = 24 + 28 + 24

    export const resize = (w: number, h: number) => {
        const menuH = core.isMobile ? (121 / 701) * w : 0
        data.tabH = h - 30 - menuH - 20

        if (data.started) {
            setStyle(elements.separator, 'height', ``)
            setStyle(elements.sheet, 'height', ``)
            setStyle(elements.sheet, 'opacity', `0`)
            setStyle(elements.startEnd, 'height', getPx(LOW_START_END_BTN))
            setStyle(elements.startEndBtn, 'padding', '12px 0')
            setTimeout(() => {
                const sheetH = elements.sheet.getBoundingClientRect().height
                setStyle(elements.separator, 'height', getPx(sheetH < data.tabH ? data.tabH - sheetH : 0))
                setStyle(elements.sheet, 'opacity', `1`)
            }, 30)
        } else {
            setStyle(elements.sheet, 'height', `calc(${getPx(h - LOW_START_END_BTN - menuH)})`)
            setStyle(elements.startEnd, 'height', getPx(h - 30 - menuH - 20))
            setStyle(elements.startEndBtn, 'padding', '24px 0')
        }
    }

    const setQuestion = async () => {
        const item = await engine.getItem()
        data.answers.origin = item

        inner(elements.info, `${item.question.id}, ${item.question.used.length}`)

        inner(elements.question, item.question.question)
        const answers = [{
            content: item.question.answer,
            correct: true,
        }]
        item.question.falseAnswers.forEach(fa => {
            answers.push({
                content: fa,
                correct: false,
            })
        })
        data.answers.shuffled = shuffle(answers)
        elements.answers.forEach((a, i) => {
            inner(a, data.answers.shuffled[i].content)
        })


    }

    const start = async () => {
        data.started = true
        display(elements.sheet, 'block')
        resize(window.visualViewport.width, window.visualViewport.height)
        mark(-1)()
        await engine.init()
        setQuestion()

        inner(elements.startEndBtn, 'Zakończ')
        setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_4_color)')
        remove(elements.startEndBtn, 'click', start)
        add(elements.startEndBtn, 'click', end)
    }

    const end = () => {
        data.started = false
        display(elements.sheet, 'none')
        resize(window.visualViewport.width, window.visualViewport.height)

        inner(elements.startEndBtn, 'Rozpocznij')
        setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_color)')
        remove(elements.startEndBtn, 'click', end)
        add(elements.startEndBtn, 'click', start)
    }

    export const active = () => {
        elements.answersField.forEach((a, i) => add(a, 'click', mark(i)))
        add(elements.startEndBtn, 'click', data.started ? end : start)
        add(elements.confirm, 'click', setQuestion)
    }

    export const deactivate = () => {
        elements.answersField.forEach((a, i) => remove(a, 'click', mark(i)))
        remove(elements.startEndBtn, 'click', start)
        remove(elements.startEndBtn, 'click', end)
        remove(elements.confirm, 'click', setQuestion)
    }
}