namespace tab {
    export namespace mobile {
        const { byId, byQuery, byQAll, getPx, setStyle } = dom

        export type ElementsT = {
            menu: HTMLElement | null
            back: HTMLElement | null
            list: HTMLElement | null
            items: HTMLElement[] | null
            dot: HTMLElement | null
            iconHide: HTMLElement | null
        }

        export const elements: ElementsT = {
            menu: null,
            back: null,
            list: null,
            items: null,
            dot: null,
            iconHide: null,
        }

        export const resize = () => {
            touch.resize()
        }

        export const init = () => {
            elements.menu = byId('menu-mobile') as HTMLElement
            elements.back = byId('menu-mobile-back') as HTMLElement
            elements.list = byQuery('.menu-mobile-list') as HTMLElement
            elements.items = byQAll(elements.menu, '.menu-mobile-item') as undefined as HTMLElement[]
            elements.dot = byId('menu-mobile-dot') as HTMLElement
            elements.iconHide = byId('menu-mobile-icon-hide') as HTMLElement

            setStyle(elements.back, 'display', 'initial')

            touch.init()
        }
    }
}