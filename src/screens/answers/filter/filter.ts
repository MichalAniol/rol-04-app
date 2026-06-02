import { byId, setStyle, add, remove } from '../../../dom'
import { areNotNull } from '../../../utils/isNotNull'

type ElementsT = {
    answersFilter: HTMLElement
    answersFilterMore: HTMLElement
    answersFilterLess: HTMLElement
    answersFilterContent: HTMLElement
}

const elements = {} as ElementsT

type StateT = {
    answersFilterContentHeight: number | null,
    open: boolean,
}

const state: StateT = {
    answersFilterContentHeight: null,
    open: false,
}

export const init = () => {
    elements.answersFilter = byId('answers-filter-title') as HTMLElement
    elements.answersFilterMore = byId('answer-filter-more') as HTMLElement
    elements.answersFilterLess = byId('answer-filter-less') as HTMLElement
    elements.answersFilterContent = byId('answer-filter-content') as HTMLElement
    areNotNull(elements, ['settings', 'info'])

    setTimeout(() => {
        const contentBox = elements.answersFilterContent.getBoundingClientRect()
        state.answersFilterContentHeight = contentBox.height

        setStyle(elements.answersFilterLess, 'display', 'none')
        setStyle(elements.answersFilterContent, 'height', '0px')
    }, 100)
}

const showInfo = () => {
    if (state.open) {
        setStyle(elements.answersFilterLess, 'display', 'none')
        setStyle(elements.answersFilterMore, 'display', 'initial')
        setStyle(elements.answersFilterContent, 'height', '0px')
    } else {
        setStyle(elements.answersFilterLess, 'display', 'initial')
        setStyle(elements.answersFilterMore, 'display', 'none')
        setStyle(elements.answersFilterContent, 'height', `${state.answersFilterContentHeight}px`)
    }
    state.open = !state.open
}


export const active = () => {
    add(elements.answersFilter, 'click', showInfo)
}

export const deactivate = () => {
    remove(elements.answersFilter, 'click', showInfo)
}