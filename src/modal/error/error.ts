namespace modal {
    const { byId, byQuery, getPx, setStyle, inner, add, remove } = dom

    type ElementsT = {
        modal: HTMLElement | null
        txt: HTMLElement | null
        info: HTMLElement | null
        btn: HTMLButtonElement | null
    }

    const elements: ElementsT = {
        modal: null,
        txt: null,
        info: null,
        btn: null,
    }

    const reload = () => window.location.reload()

    let close: () => null | null = null

    export const error = {
        init: () => {
            elements.modal = byId('modal-error')
            elements.txt = byId('modal-error-txt')
            elements.info = byId('modal-error-info')
            elements.btn = byId('modal-error-btn') as HTMLButtonElement
        },
        show: (err: string, canWork: boolean, onClose: () => null) => {
            show()
            setStyle(elements.modal, 'display', 'flex')
            close = onClose

            if (canWork) {
                inner(elements.txt, err)
                inner(elements.info, "Będzie działać dzięki zapamiętanym danym.")
                setStyle(elements.info, 'color', 'var(--on_prime_color)')
                inner(elements.btn, 'Dalej')
                add(elements.btn, 'click', error.hide)
            } else {
                inner(elements.txt, err)
                inner(elements.info, 'Brak danych aby uruchomić aplikację.')
                setStyle(elements.info, 'color', 'var(--off_prime_color)')
                inner(elements.btn, 'Przeładuj')
                add(elements.btn, 'click', reload)
            }
        },
        hide: () => {
            hide()
            setStyle(elements.modal, 'display', 'none')
            remove(elements.btn, 'click', reload)
            remove(elements.btn, 'click', error.hide)
            if (close) close()
        }
    }
}