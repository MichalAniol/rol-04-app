namespace settings {
    export namespace info {
        type ElementsT = {
            settingsAppInfo: HTMLElement | null
            settingsAppInfoMore: HTMLElement | null
            settingsAppInfoLess: HTMLElement | null
            settingsAppInfoContent: HTMLElement | null
        }

        const { byId, byQuery, getPx, setStyle, add, remove } = dom

        const elements: ElementsT = {
            settingsAppInfo: null,
            settingsAppInfoMore: null,
            settingsAppInfoLess: null,
            settingsAppInfoContent: null,
        }

        type StateT = {
            settingsAppInfoContentHeight: number | null

        }

        const state: StateT = {
            settingsAppInfoContentHeight: null
        }

        export const init = () => {
            elements.settingsAppInfo = byId('settings-app-info-title')
            elements.settingsAppInfoMore = byId('settings-app-info-more')
            elements.settingsAppInfoLess = byId('settings-app-info-less')
            elements.settingsAppInfoContent = byId('settings-app-info-content')

            const contentBox = elements.settingsAppInfoContent.getBoundingClientRect()
            state.settingsAppInfoContentHeight = contentBox.height

            setStyle(elements.settingsAppInfoLess, 'display', 'none')
            setStyle(elements.settingsAppInfoContent, 'height', '0px')
        }

        export const active = () => {
            add(elements.settingsAppInfo, 'click', () => {
                setStyle(elements.settingsAppInfoContent, 'height', `${state.settingsAppInfoContentHeight}px`)
            })

        }

        export const deactivate = () => { }
    }
}