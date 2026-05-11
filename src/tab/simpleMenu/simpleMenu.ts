namespace tab {
    // LINK doc\adr\0002.tab-menu.md
    export namespace simpleMenu {
        const { byId, byQuery, byQAll, getPx, setStyle, add } = dom

        export type ElementsT = {
            menu: HTMLElement | null
            // back: HTMLElement | null
            list: HTMLElement | null
            items: HTMLElement[] | null
            iconShowHide: HTMLElement | null
            iconShow: HTMLElement | null
            iconHide: HTMLElement | null
            iconHideSvg: SVGElement | null
        }

        export const elements: ElementsT = {
            menu: null,
            // back: null,
            list: null,
            items: null,
            iconShowHide: null,
            iconShow: null,
            iconHide: null,
            iconHideSvg: null,
        }

        export const resize = () => {
            // touch.resize()
        }

       const setIconsColor = (index: number) => elements.items.forEach((item, i) => {
            if (index === i) {
                setStyle(item, 'fill' , 'var(--mine_color)')
            } else {
                setStyle(item, 'fill' , 'var(--mine_5_color)')
            }
        })

        export const init = (getGoTo: (screenNum: number) => () => void) => {
            elements.menu = byId('menu-mobile') as HTMLElement
            // elements.back = byId('menu-mobile-back') as HTMLElement
            elements.list = byQuery('.menu-mobile-list') as HTMLElement
            elements.items = byQAll(elements.menu, '.menu-mobile-item') as undefined as HTMLElement[]
            elements.iconShowHide = byId('menu-mobile-icon-menu') as HTMLElement
            elements.iconShow = byId('menu-mobile-icon-show') as HTMLElement
            elements.iconHide = byId('menu-mobile-icon-hide') as HTMLElement
            elements.iconHideSvg = byId('menu-mobile-icon-hide-svg') as SVGElement

            elements.items.forEach((item, index) => {
                const goTo = getGoTo(index)
                add(item, 'click', () => {
                    goTo()
                    setIconsColor(index)
                })
            })

            setIconsColor(0)
            // setStyle(elements.items[0], 'fill', 'var(--mine_color)')
            // setStyle(elements.back, 'display', 'initial')

            // touch.init()
            visible.init()
        }
    }
}