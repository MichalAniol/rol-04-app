import { areNotNull } from '@/utils/isNotNull'
import { byId, setStyle, add, remove, inner, enable, disable, display } from '../../dom'
import { show, hide } from '../modal'
import { set as userSet } from '@/queries/user/setId'
import { memoUserId } from '@/init/user'
import { getSecureAndCheckData } from '@/init/init'
import { validateUserId } from '@/utils/validateUserId'
import { checkId } from '@/queries/user/checkId'
import { responseCommand } from '@/queries/responseCommand'
import { getAnswersFromServer } from '@/init/data'

type ElementsT = {
    modal: HTMLElement
    btnNewUser: HTMLButtonElement
    idInfo: HTMLElement
    idInput: HTMLInputElement
    // qrCodeBtn: HTMLElement
    // qrCodeInput: HTMLInputElement
    btnOldUser: HTMLButtonElement
    btnClose: HTMLButtonElement
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
    elements.btnClose = byId('modal-user-btn-close') as HTMLButtonElement

    areNotNull(elements, ['modal', 'user'])
}

const setNewUser = async () => {
    const userIdSet = await userSet()
    memoUserId(userIdSet.userId || '')
    getSecureAndCheckData()
}

const no = (text: string) => {
    inner(elements.idInfo, text)
    setStyle(elements.idInfo, 'color', 'var(--off_prime_color)')
    disable(elements.btnOldUser)
}

// regx dla wpisywania user id
const getValidateUserId = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    const validate = validateUserId(value)

    if (validate.correct) {
        inner(elements.idInfo, validate.text)
        setStyle(elements.idInfo, 'color', 'var(--on_second_color)')
        enable(elements.btnOldUser)
    } else {
        no(validate.text)
    }
}

// sprawdzenie user id w db
const checkUserId = async () => {
    const userIdSet = await checkId(elements.idInput.value)
    const state = userIdSet.command

    if (state === responseCommand.user.ok) {
        memoUserId(elements.idInput.value)
        hideUserModal()
        getSecureAndCheckData()
        getAnswersFromServer()
    } else {
        no('Niema takiego użytkownika')
    }
}

const click = async () => {
    await setNewUser()
    hideUserModal()
}

export const showUserModal = (required: boolean = true) => {
    show()
    const { modal, btnNewUser, idInput, btnOldUser } = elements

    display(modal, 'flex')

    btnOldUser.disabled = true
    // add(elements.qrCodeInput, 'change', fileAdded)

    add(btnNewUser, 'click', click)
    add(idInput, 'input', getValidateUserId)
    add(btnOldUser, 'click', checkUserId)

    display(elements.btnClose, required ? 'none' : 'block')
    add(elements.btnClose, 'click', hideUserModal)
}

export const hideUserModal = () => {
    hide()
    setStyle(elements.modal, 'display', 'none')

    const { btnNewUser, idInput, btnOldUser } = elements
    remove(btnNewUser, 'click', click)
    remove(idInput, 'input', getValidateUserId)
    remove(btnOldUser, 'click', checkUserId)
    remove(elements.btnClose, 'click', hideUserModal)
}