import { add, byId, disable, enable, inner, remove, setStyle } from "@/dom"
import { memoUserId } from "@/init/user"
import { showUserModal } from "@/modal/user/user"
import { responseCommand } from "@/queries/responseCommand"
import { checkId } from "@/queries/user/checkId"
import { areNotNull } from "@/utils/isNotNull"
import { validateUserId } from "@/utils/validateUserId"

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

export const active = () => {
    add(elements.btnChangeUser, 'click', setUserId)
    // add(elements.btnChangeUser, 'click', () => showChangeUserModal(setInfoUserId, checkUserId))
}

export const deactivate = () => {
    remove(elements.btnChangeUser, 'click', setUserId)
}