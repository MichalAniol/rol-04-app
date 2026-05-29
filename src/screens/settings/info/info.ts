import { byId, setStyle, add, remove } from '../../../dom'
import { areNotNull } from '../../../utils/isNotNull'

type ElementsT = {
    settingsAppInfo: HTMLElement
    settingsAppInfoMore: HTMLElement
    settingsAppInfoLess: HTMLElement
    settingsAppInfoContent: HTMLElement
}


const elements = {} as ElementsT

type StateT = {
    settingsAppInfoContentHeight: number | null,
    open: boolean,
}

const state: StateT = {
    settingsAppInfoContentHeight: null,
    open: false,
}

export const init = () => {
    elements.settingsAppInfo = byId('settings-app-info-title') as HTMLElement
    elements.settingsAppInfoMore = byId('settings-app-info-more') as HTMLElement
    elements.settingsAppInfoLess = byId('settings-app-info-less') as HTMLElement
    elements.settingsAppInfoContent = byId('settings-app-info-content') as HTMLElement
    areNotNull(elements, ['settings', 'info'])

    setTimeout(() => {
        const contentBox = elements.settingsAppInfoContent.getBoundingClientRect()
        state.settingsAppInfoContentHeight = contentBox.height

        setStyle(elements.settingsAppInfoLess, 'display', 'none')
        setStyle(elements.settingsAppInfoContent, 'height', '0px')
    }, 100)
}

const showInfo = () => {
    if (state.open) {
        setStyle(elements.settingsAppInfoLess, 'display', 'none')
        setStyle(elements.settingsAppInfoMore, 'display', 'initial')
        setStyle(elements.settingsAppInfoContent, 'height', '0px')
    } else {
        setStyle(elements.settingsAppInfoLess, 'display', 'initial')
        setStyle(elements.settingsAppInfoMore, 'display', 'none')
        setStyle(elements.settingsAppInfoContent, 'height', `${state.settingsAppInfoContentHeight}px`)
    }
    state.open = !state.open
}


export const active = () => {
    add(elements.settingsAppInfo, 'click', showInfo)
}

export const deactivate = () => {
    remove(elements.settingsAppInfo, 'click', showInfo)
}