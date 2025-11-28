

namespace tab {
    type ElementsT = {
        carousel: HTMLElement | null
        carouselBox: HTMLElement | null
        allTabs: HTMLElement | null
        tabs: HTMLElement[] | null
        menu: {
            web: HTMLElement | null
            mobile: HTMLElement | null
            items: HTMLElement[] | null
        }
    }

    const { byId, byQueryAll, getPx, setStyle, display, add } = dom

    const WEB_MENU_WIDTH = 200

    const elements: ElementsT = {
        carousel: null,
        carouselBox: null,
        allTabs: null,
        tabs: null,
        menu: {
            web: null,
            mobile: null,
            items: null
        },
    }

    const state = {
        screen: 0,
        max: 0,
        carouselLeftPos: 0,
        tabWidth: 0,
    }

    const getTabLeftPos = () => (state.tabWidth * state.screen)
    const setTab = () => {
        elements.carousel.style.left = getPx(-getTabLeftPos())
        elements.menu.items.forEach((t, i) => {
            if (i === state.screen) {
                setStyle(t, 'backgroundColor', 'var(--mine_color)')
                setStyle(t, 'color', 'var(--last_color)')
            } else {
                setStyle(t, 'backgroundColor', 'var(--penultimate_color)')
                setStyle(t, 'color', 'var(--prime_color)')
            }
        })
    }

    export const goLeft = () => {
        if (state.screen > 0) {
            state.screen--
            setTab()
        }
    }

    export const goRight = () => {
        if (state.screen < state.max - 1) {
            state.screen++
            setTab()
        }
    }

    export const getGoTo = (screenNum: number) => () => {
        state.screen = screenNum
        setTab()
    }

    export const blur = () => {
        setStyle(elements.allTabs, 'filter', 'blur(5px)')

        // setTimeout(() => {
        //     setStyle(elements.allTabs, 'filter', 'blur(5px)')
        // }, 30)
    }

    export const unBlur = () => {
        setStyle(elements.allTabs, 'filter', 'blur(0px)')

        // setTimeout(() => {
        //     setStyle(elements.allTabs, 'filter', 'blur(0px)')
        // }, 30)
    }

    export const init = () => {
        elements.carousel = byId('carousel')
        elements.carouselBox = byId('carousel-box')
        elements.allTabs = byId('tabs')
        elements.tabs = byQueryAll('.tab') as unknown as HTMLElement[]

        state.max = elements.tabs.length

        elements.menu.mobile = byId('menu-mobile')
        elements.menu.web = byId('menu-web')

        if (core.isMobile) {
            display(elements.menu.web, 'none')

            elements.menu.items = byQueryAll('.menu-mobile-item') as unknown as HTMLElement[]
            for (let i = 0; i < elements.menu.items.length; ++i) {
                const item = elements.menu.items[i]
                add(item, 'click', getGoTo(i))
            }
        } else {
            display(elements.menu.mobile, 'none')
            state.carouselLeftPos = WEB_MENU_WIDTH

            elements.menu.items = byQueryAll('.menu-web-item') as unknown as HTMLElement[]
            for (let i = 0; i < elements.menu.items.length; ++i) {
                const item = elements.menu.items[i]
                add(item, 'click', getGoTo(i))
            }
        }
    }

    export const resize = (w: number, h: number) => {
        state.tabWidth = w - state.carouselLeftPos

        for (let i = 0; i < elements.tabs.length; ++i) {
            const tab = elements.tabs[i]
            setStyle(tab, 'width', getPx(state.tabWidth))
            setStyle(tab, 'height', getPx(h))
        }

        setStyle(elements.allTabs, 'width', getPx(w))
        setStyle(elements.allTabs, 'height', getPx(h))

        setStyle(elements.carouselBox, 'width', getPx(state.tabWidth))
        setStyle(elements.carouselBox, 'left', getPx(state.carouselLeftPos))

        setStyle(elements.carousel, 'width', getPx(state.max * state.tabWidth))

        setTab()
    }
}