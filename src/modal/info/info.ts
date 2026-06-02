import { add, byId, display, remove } from "@/dom"
import { areNotNull } from "@/utils/isNotNull"
import { hide, show } from "../modal"


type ElementsT = {
    modal: HTMLElement
    btnClose: HTMLButtonElement
}
const elements = {} as ElementsT

export const init = () => {
    elements.modal = byId('modal-info') as HTMLElement
    elements.btnClose = byId('modal-info-btn-close') as HTMLButtonElement

    areNotNull(elements, ['modal', 'user'])

    display(elements.modal, 'none')
}

export const showInfoModal = () => {
    show()
    display(elements.modal, 'flex')
    add(elements.btnClose, 'click', closeModal)
}

const closeModal = () => {
    hide()
    display(elements.modal, 'none')
    remove(elements.btnClose, 'click', closeModal)
}

