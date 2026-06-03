import { add, byId, remove } from "@/dom"
import { clearAnswers } from "@/init/data"
import { showInfoModal } from "@/modal/info/info"
import { showUserModal } from "@/modal/user/user"
import { areNotNull } from "@/utils/isNotNull"

type ElementsT = {
    btnChangeUser: HTMLButtonElement
    btnReset: HTMLButtonElement
}

const elements = {} as ElementsT

export const init = () => {
    elements.btnChangeUser = byId('settings-option-change-user-btn') as HTMLButtonElement
    elements.btnReset = byId('settings-option-reset-btn') as HTMLButtonElement

    areNotNull(elements, ['modal', 'user'])
}

const setUserId = () => showUserModal(false)
const reset = () => {showInfoModal('Reset odpowiedzi', 'Wszystkie odpowiedzi zostaną usunięte. Nauka zacznie się od początku.', true, true, clearAnswers)}

export const active = () => {
    add(elements.btnChangeUser, 'click', setUserId)
    add(elements.btnReset, 'click', reset)
    // add(elements.btnChangeUser, 'click', () => showChangeUserModal(setInfoUserId, checkUserId))
}

export const deactivate = () => {
    remove(elements.btnReset, 'click', setUserId)
    remove(elements.btnChangeUser, 'click', reset)
}