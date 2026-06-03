import { add, byId, display, inner, remove } from "@/dom"
import { areNotNull } from "@/utils/isNotNull"
import { hide, show } from "../modal"


type ElementsT = {
    modal: HTMLElement
    title: HTMLElement
    text: HTMLElement
    btnOk: HTMLButtonElement
    btnCancel: HTMLButtonElement
}
const elements = {} as ElementsT

export const init = () => {
    elements.modal = byId('modal-info') as HTMLElement
    elements.title = byId('modal-info-title') as HTMLElement
    elements.text = byId('modal-info-section') as HTMLElement
    elements.btnOk = byId('modal-info-btn-ok') as HTMLButtonElement
    elements.btnCancel = byId('modal-info-btn-cancel') as HTMLButtonElement
    areNotNull(elements, ['modal', 'info'])

    display(elements.modal, 'none')
}

type FnsT = {
    ok: () => void
    cancel: () => void
}
const fns = {} as FnsT

const withClose = (fn: () => void) => () => {
    fn()
    closeModal()
}

export const showInfoModal = (title: string, text: string, ok: boolean, cancel: boolean, okFn?: () => void, cancelFn?: () => void) => {
    inner(elements.title, title)
    inner(elements.text, text)
    display(elements.btnOk, ok ? 'block' : 'none')
    display(elements.btnCancel, cancel ? 'block' : 'none')

    fns.ok = okFn ? withClose(okFn) : closeModal
    fns.cancel = cancelFn ? withClose(cancelFn) : closeModal

    show()
    display(elements.modal, 'flex')
    add(elements.btnOk, 'click', fns.ok)
    add(elements.btnCancel, 'click', fns.cancel)
}

const closeModal = () => {
    hide()
    display(elements.modal, 'none')
    remove(elements.btnOk, 'click', fns.ok)
    remove(elements.btnCancel, 'click', fns.cancel)
}

