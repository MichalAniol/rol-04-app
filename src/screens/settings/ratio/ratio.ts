import { byId, add, remove, inner } from '../../../dom'
import { areNotNull } from '../../../utils/isNotNull'
import { core } from '../../../core'
import { determinants, data } from '../../../engine/params'
import { storageNames } from '@/storage'

type ElementsT = {
    settingsSliderRepeatable: HTMLElement
    settingsSliderSingle: HTMLElement
    settingsSliderInput: HTMLInputElement
}

const elements = {} as ElementsT

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
    areNotNull(elements, ['settings', 'ratio'])

    state.ratio = Number(await core.store.get(storageNames.questionsRatio))
    elements.settingsSliderInput.value = state.ratio.toString()
    elements.settingsSliderInput.max = determinants.questionInSession.toString()

    inner(elements.settingsSliderRepeatable, state.ratio.toString())
    inner(elements.settingsSliderSingle, (determinants.questionInSession - state.ratio).toString())
}

const showRatio = (event: Event) => {
    const value = (event.target as HTMLInputElement).value

    inner(elements.settingsSliderRepeatable, value)
    inner(elements.settingsSliderSingle, (determinants.questionInSession - Number(value)).toString())
}

const memoRatio = async (event: Event) => {
    const value = (event.target as HTMLInputElement).value

    state.ratio = Number(value)
    await core.store.set(storageNames.questionsRatio, value)

    data.numOfQuestions.repeatable = state.ratio
    const single = determinants.questionInSession - state.ratio
    data.numOfQuestions.single = single
}

export const active = () => {
    add(elements.settingsSliderInput, 'input', showRatio)
    add(elements.settingsSliderInput, 'change', memoRatio)
}

export const deactivate = () => {
    remove(elements.settingsSliderInput, 'input', showRatio)
    remove(elements.settingsSliderInput, 'change', memoRatio)
}