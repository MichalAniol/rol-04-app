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

            setTimeout(() => {
                const contentBox = elements.settingsAppInfoContent.getBoundingClientRect()
                state.settingsAppInfoContentHeight = contentBox.height
                console.log('%c state.settingsAppInfoContentHeight:', 'background:rgb(3, 169, 61); color: #003300', state.settingsAppInfoContentHeight, state.open)

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
    }
}