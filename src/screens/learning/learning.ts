namespace learning {
    type ElementsT = {
        sheet: HTMLElement | null
        question: HTMLElement | null
        answers: HTMLElement[] | null
        answersField: HTMLElement[] | null
        checkbox: HTMLInputElement[] | null
        confirm: HTMLElement | null
    }

    const { byId, byQueryAll, setStyle, add, remove, display } = dom

    const elements: ElementsT = {
        sheet: null,
        question: null,
        answers: null,
        answersField: null,
        checkbox: null,
        confirm: null,
    }

    type DataT = {
        mark: number,
    }

    const data = {
        mark: 0,
    }

    const mark = (num: number) => () => {
        data.mark = num
        elements.checkbox.forEach((a, i) => a.checked = (i === num))
        elements.answersField.forEach((a, i) => i === num ? setStyle(a, 'border', '2px solid var(--mine_color)') : setStyle(a, 'border', '2px solid transparent'))
    }

    export const init = () => {
        elements.sheet = byId('learning-sheet') as HTMLElement
        elements.question = byId('question') as HTMLElement
        elements.answers = byQueryAll('.answer p') as unknown as HTMLElement[]
        elements.answersField = byQueryAll('.answer') as unknown as HTMLElement[]
        elements.checkbox = byQueryAll('.answer input') as unknown as HTMLInputElement[]
        elements.checkbox.forEach(c => c.checked = false)
        elements.confirm = byId('learning-confirm-btn') as HTMLElement
        utils.areNotNull(elements, ['screens', 'learning'])

        mark(-1)()
        display(elements.sheet, 'none')
        display(elements.confirm, 'none')
    }
    
    const  start = () => {
        display(elements.sheet, 'block')
        display(elements.confirm, 'flex')
    }

    export const active = () => {
        elements.answersField.forEach((a, i) => add(a, 'click', mark(i)))
    }

    export const deactivate = () => {
        elements.answersField.forEach((a, i) => remove(a, 'click', mark(i)))
    }
}