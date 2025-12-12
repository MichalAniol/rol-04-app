namespace learning {
    type ElementsT = {
        question: HTMLElement | null
        answers: HTMLElement[] | null
        answersField: HTMLElement[] | null
        checkbox: HTMLInputElement[] | null
        confirm: HTMLElement | null
    }

    const { byId, byQueryAll, setStyle, add, remove } = dom

    const elements: ElementsT = {
        question: null,
        answers: null,
        answersField: null,
        checkbox: null,
        confirm: null,
    }

    const mark = (num: number) => () => {
        elements.checkbox.forEach((a, i) => a.checked = (i === num))
        elements.answersField.forEach((a, i) => i === num ? setStyle(a, 'border', '2px solid var(--mine_color)') : setStyle(a, 'border', '2px solid transparent'))
    }

    export const init = () => {
        elements.question = byId('question')

        elements.answers = byQueryAll('.answer p') as unknown as HTMLElement[]

        elements.answersField = byQueryAll('.answer') as unknown as HTMLElement[]

        elements.checkbox = byQueryAll('.answer input') as unknown as HTMLInputElement[]
        elements.checkbox.forEach(c => c.checked = false)

        elements.confirm = byId('learning-confirm-btn')

        mark(-1)()
    }

    export const active = () => {
        elements.answersField.forEach((a, i) => add(a, 'click', mark(i)))
    }

    export const deactivate = () => {
        elements.answersField.forEach((a, i) => remove(a, 'click', mark(i)))
    }
}