namespace modal {
    const { byId, getPx, setStyle, add } = dom

    type ElementsT = {
        modal: HTMLElement | null
        back: HTMLElement | null
    }

    const elements: ElementsT = {
        modal: null,
        back: null,
    }

    export const init = () => {
        elements.modal = byId('modal') as HTMLElement
        elements.back = byId('modal-back') as HTMLElement
        utils.isNotNull(elements)

        // const testBtn = byId('test-btn')
        // add(testBtn, 'click', () => {
        //     user.show()
        // })

        error.init()
        user.init()
    }

    export const resize = (w: number, h: number) => {
        setStyle(elements.back, 'width', getPx(w))
        setStyle(elements.back, 'height', getPx(h))
    }

    let visible = false

    export const show = () => {
        visible = true
        setStyle(elements.modal, 'opacity', '0')
        setStyle(elements.modal, 'display', 'flex')
        setTimeout(() => {
            setStyle(elements.modal, 'opacity', '1')
        }, 30)
        tab.blur()
    }

    export const hide = () => {
        visible = false
        setStyle(elements.modal, 'opacity', '0')
        setTimeout(() => {
            if (!visible) {
                setStyle(elements.modal, 'display', 'none')
            }
        }, 330)
        tab.unBlur()
    }
}