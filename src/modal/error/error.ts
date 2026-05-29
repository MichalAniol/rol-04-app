
import { byId, setStyle, inner, add, remove } from '../../dom'
import { show, hide } from '../modal'

type ElementsT = {
    modal: HTMLElement
    txt: HTMLElement
    info: HTMLElement
    btn: HTMLButtonElement
}

const elements = {} as ElementsT 

const reload = () => window.location.reload()

let close: (() => void) | null = null

export const error = {
    init: () => {
        elements.modal = byId('modal-error') as HTMLElement
        elements.txt = byId('modal-error-txt') as HTMLElement
        elements.info = byId('modal-error-info') as HTMLElement
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
