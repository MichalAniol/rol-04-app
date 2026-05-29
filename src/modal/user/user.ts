import { areNotNull } from '@/utils/isNotNull'
import { byId, setStyle, add } from '../../dom'
import { show, hide } from '../modal'

type ElementsT = {
    modal: HTMLElement
    btnNewUser: HTMLButtonElement
    idInfo: HTMLElement
    idInput: HTMLInputElement
    // qrCodeBtn: HTMLElement
    // qrCodeInput: HTMLInputElement
    btnOldUser: HTMLButtonElement
}

const elements = {} as ElementsT

export const init = () => {
    elements.btnNewUser = byId('modal-user-btn-new-user') as HTMLButtonElement
    elements.modal = byId('modal-user') as HTMLElement
    elements.idInfo = byId('modal-user-id-info') as HTMLElement
    elements.idInput = byId('modal-user-id-input') as HTMLInputElement
    // elements.qrCodeBtn = byId('modal-user-qr-code-btn') as HTMLElement
    // elements.qrCodeInput = byId('modal-user-qr-code-file') as HTMLInputElement
    elements.btnOldUser = byId('modal-user-btn-old-user') as HTMLButtonElement

    areNotNull(elements, ['modal', 'user'])
}

export const showUserModal = (
    setNewUser: () => void,
    getValidateUserId: (info: HTMLElement, btn: HTMLButtonElement) => (event: Event) => void,
    getCheckUserId: (info: HTMLElement, btn: HTMLButtonElement, input: HTMLInputElement, hide: () => void) => EventListenerOrEventListenerObject
) => {
    show()

    const { modal, btnNewUser, idInfo, idInput, btnOldUser } = elements

    setStyle(modal, 'display', 'flex')
    btnOldUser.disabled = true
    // add(elements.qrCodeInput, 'change', fileAdded)

    add(btnNewUser, 'click', async () => {
        await setNewUser()
        hideUserModal()
    })

    const validateUserId = getValidateUserId(idInfo, btnOldUser)
    add(idInput, 'input', validateUserId)

    const checkUserId = getCheckUserId(idInfo, btnOldUser, idInput, hideUserModal)
    add(btnOldUser, 'click', checkUserId)
}

export const hideUserModal = () => {
    hide()
    setStyle(elements.modal, 'display', 'none')
    // remove(elements.qrCodeInput, 'change', fileAdded)
}
