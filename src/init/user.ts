import { setUserId } from '../screens/starter/starter'
import { responseCommand } from '../queries/responseCommand'
import { getSecure } from '../queries/secure/secure'
import { showUserModal } from '../modal/user/user'
import { isAppInstalled, showInstallerModal } from '../modal/installer/installer'
import { core } from '@/core'
import { storageNames } from '@/storage'
import { getSecureAndCheckData } from './init'

export const memoUserId = (userId: string) => {
    core.store.set(storageNames.userId, userId)
    setUserId(userId)
}

export const init = async () => {
    const secure = await getSecure()
    // console.log('%c secure:', 'background:rgb(0, 42, 255); color: #003300', secure)

    const startApp = () => {
        if (secure.command === responseCommand.secure.generateUserId) {
            showUserModal()
        } else if (secure.command === responseCommand.secure.go) {
            memoUserId(secure.userId || '')
            getSecureAndCheckData()
        }
    }

    // sprawdzenie czy appka jest zainstalowana
    if (!(process.env.DEBUG === "true")) {
        if (!isAppInstalled()) {
            showInstallerModal(startApp)
        } else {
            startApp()
        }
    } else {
        startApp()
    }


    // if (secure === null) {
    // }
}
