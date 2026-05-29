import { elements } from '../starter'
import { inner, setStyle, disable, enable } from '../../../dom'
import { getSecure } from '../../../queries/secure/secure'
import { showUserModal } from '../../../modal/user/user'
import { set as userSet } from '../../../queries/user/setId'
import { checkId } from '../../../queries/user/checkId'
import { responseCommand } from '../../../queries/responseCommand'
import { isAppInstalled, showInstallerModal } from '../../../modal/installer/installer'
import { core } from '@/core'
import { storageNames } from '@/storage'

const memoUserId = (userId: string) => {
    core.store.set(storageNames.userId, userId)
    inner(elements.userId, userId)
}

const alphabetData = {
    azSmall: 'qwertyuiopasdfghjklzxcvbnm',
    azBig: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    numbers: '1234567890',
} as const
const ALPHABET = alphabetData.numbers + alphabetData.azSmall + alphabetData.azBig
const regex = new RegExp(`^[${ALPHABET}]{21}$`)

export const init = async (dataCheck: (getAnswersFromMemo: boolean) => Promise<void>) => {
    const go = async (getAnswersFromMemo: boolean = false) => {
        await getSecure()
        setTimeout(() => dataCheck(getAnswersFromMemo), 100)
    }

    const secure = await getSecure()
    console.log('%c secure:', 'background:rgb(0, 42, 255); color: #003300', secure)

    const startApp = () => {
        if (secure.command === responseCommand.secure.generateUserId) {
            // set new user
            const setNewUser = async () => {
                const userIdSet = await userSet()
                memoUserId(userIdSet.userId || '')

                go()
            }

            const getNo = (info: HTMLElement, btn: HTMLButtonElement) => (text: string) => {
                inner(info, text)
                setStyle(info, 'color', 'var(--off_prime_color)')
                disable(btn)
            }

            // regx dla wpisywania user id
            const validateUserId = (info: HTMLElement, btn: HTMLButtonElement) => (event: Event) => {
                const value = (event.target as HTMLInputElement).value
                const no = getNo(info, btn)

                if (value.length < 21) {
                    no('Za krótki min 21 znaków')
                    return
                }

                if (value.length > 21) {
                    no('Za długi max 21 znaków')
                    return
                }

                if (!regex.test(value)) {
                    no('String zawiera niedozwolone znaki')
                    return
                }

                inner(info, 'jest OK.')
                setStyle(info, 'color', 'var(--on_second_color)')
                enable(btn)
            }

            // sprawdzenie user id w db
            const checkUserId = (info: HTMLElement, btn: HTMLButtonElement, input: HTMLInputElement, hide: () => void) => async () => {
                const userIdSet = await checkId(input.value)
                const state = userIdSet.command
                const no = getNo(info, btn)

                if (state === responseCommand.user.ok) {
                    memoUserId(input.value)
                    hide()
                    go(true)
                } else {
                    no('Niema takiego użytkownika')
                }
            }

            showUserModal(setNewUser, validateUserId, checkUserId)
        } else if (secure.command === responseCommand.secure.go) {
            memoUserId(secure.userId || '')
            go()
        }
    }

    // sprawdzenie czy appka jest zainstalowana
    if (!isAppInstalled()) {
        showInstallerModal(startApp)
    } else {
        startApp()
    }

    // if (secure === null) {
    // }
}
