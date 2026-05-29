
// LINK doc\adr\0002.tab-menu.md
import { byId, byQuery, byQAll, setStyle, add, display } from '../../dom'
import { init as visibleInit } from './visible'
import { areNotNull } from '../../utils/isNotNull'

export type ElementsT = {
    menu: HTMLElement
    // back: HTMLElement 
    list: HTMLElement
    items: HTMLElement[]
    iconShowHide: HTMLElement
    iconShow: HTMLElement
    iconHide: HTMLElement
    iconHideSvg: SVGElement
}

export const elements = {} as ElementsT

// export const elements: ElementsT = {
//     menu: null,
//     // back: null,
//     list: null,
//     items: null,
//     iconShowHide: null,
//     iconShow: null,
//     iconHide: null,
//     iconHideSvg: null,
// }

export const resize = () => {
    // touch.resize()
}

export const setIconsColor = (index: number) => elements.items.forEach((item, i) => {
    if (index === i) {
        setStyle(item, 'fill', 'var(--mine_color)')
    } else {
        setStyle(item, 'fill', 'var(--mine_6_color)')
    }
})

export const init = (getGoTo: (screenNum: number) => () => void, items: HTMLElement[]) => {
    elements.menu = byId('menu-mobile') as HTMLElement
    // elements.back = byId('menu-mobile-back') as HTMLElement
    elements.list = byQuery('.menu-mobile-list') as HTMLElement
    elements.items = byQAll(elements.menu, '.menu-mobile-item') as unknown as HTMLElement[]
    elements.iconShowHide = byId('menu-mobile-icon-menu') as HTMLElement
    elements.iconShow = byId('menu-mobile-icon-show') as HTMLElement
    elements.iconHide = byId('menu-mobile-icon-hide') as HTMLElement
    elements.iconHideSvg = byId('menu-mobile-icon-hide-svg') as SVGElement

    elements.items.forEach((item, index) => {
        items.push(item)
        const goTo = getGoTo(index)
        add(item, 'click', () => {
            goTo()
            setIconsColor(index)
        })
    })
    areNotNull(elements, ['simpleMenu'])

    display(elements.menu, 'none')
    setIconsColor(0)

    // touch.init()
    visibleInit()
}

export const showMenu = () => display(elements.menu, 'flex')