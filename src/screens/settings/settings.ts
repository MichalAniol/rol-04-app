namespace settings {
    type ElementsT = {
        scrollBox: HTMLElement | null
    }

    const { byQuery, getPx, setStyle } = dom

    const elements: ElementsT = {
        scrollBox: null,
    }

    export const resize = (w: number, h: number) => {
        setStyle(elements.scrollBox, 'height', `calc(${getPx(h)} - 32px - var(--font_title_size))`)
    }

    export const init = () => {
        elements.scrollBox = byQuery('#settings-tab-box .scroll-box') as HTMLElement

        info.init()
        theme.init()
        // dataControl.init()
        menu.init()
    }

    export const active = () => {
        info.active()
        theme.ratio.active()
        // dataControl.questionsRatio.active()
        // dataControl.imgRatio.active()
    }

    export const deactivate = () => {
        info.deactivate()
        theme.ratio.deactivate()
        // dataControl.questionsRatio.deactivate()
        // dataControl.imgRatio.deactivate()
    }
}