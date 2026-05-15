namespace settings {
    export namespace ratio {
        const { byId, byQuery, getPx, setStyle, add, remove, inner } = dom

        type ElementsT = {
            settingsSliderRepeatable: HTMLElement | null
            settingsSliderSingle: HTMLElement | null
            settingsSliderInput: HTMLInputElement | null
        }

        const elements: ElementsT = {
            settingsSliderRepeatable: null,
            settingsSliderSingle: null,
            settingsSliderInput: null,
        }

        type StateT = {
            ratio: number,
        }

        const state: StateT = {
            ratio: 0,
        }

        export const init = async () => {
            elements.settingsSliderRepeatable = byId('settings-slider-repeatable') as HTMLElement
            elements.settingsSliderSingle = byId('settings-slider-single') as HTMLElement
            elements.settingsSliderInput = byId('settings-slider-input') as HTMLInputElement
            utils.areNotNull(elements, ['settings', 'ratio'])

            state.ratio = Number(await core.store.get(storageNames.questionsRatio))
            elements.settingsSliderInput.value = state.ratio.toString()
            elements.settingsSliderInput.max = engine.params.determinants.questionInSession.toString()

            inner(elements.settingsSliderRepeatable, state.ratio.toString())
            inner(elements.settingsSliderSingle, (engine.params.determinants.questionInSession - state.ratio).toString())
        }

        const showRatio = (event: Event) => {
            const value = (event.target as HTMLInputElement).value

            inner(elements.settingsSliderRepeatable, value)
            inner(elements.settingsSliderSingle, (engine.params.determinants.questionInSession - Number(value)).toString())
        }

        const memoRatio = async (event: Event) => {
            const value = (event.target as HTMLInputElement).value

            state.ratio = Number(value)
            await core.store.set(storageNames.questionsRatio, value)

            engine.params.data.numOfQuestions.repeatable = state.ratio
            const single = engine.params.determinants.questionInSession - state.ratio
            engine.params.data.numOfQuestions.single = single
        }

        export const active = () => {
            add(elements.settingsSliderInput, 'input', showRatio)
            add(elements.settingsSliderInput, 'change', memoRatio)
        }

        export const deactivate = () => {
            remove(elements.settingsSliderInput, 'input', showRatio)
            remove(elements.settingsSliderInput, 'change', memoRatio)
        }
    }
}