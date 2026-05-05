namespace starter {
    const memoUserId = (res: SecureGetResponseT | UserSetResponseT) => {
        const userId = res.userId
        core.store.set(storageNames.userId, userId)
        dom.inner(elements.userId, userId)
    }

    export const run = async () => {
        const secure = await queries.secure.getSecure()
        console.log('%c secure:', 'background:rgb(0, 42, 255); color: #003300', secure)

        if (secure.command === queries.responseCommand.secure.generateUserId) {
            // set new user

            // regx dla wpisywania user id

            // sprawdzenie user id w db




            modal.user.show()

            setTimeout(async () => {
                const userIdSet = await queries.user.set()
                memoUserId(userIdSet)

            }, 300)
        } else if (secure.command === queries.responseCommand.secure.go) {
            memoUserId(secure)
        }

        console.log('%c secure:', 'background: #ffcc00; color: #003300', secure)

        if (secure === null) {

        }
    }

    // czy nowy użytkownik
    // jak nie to wprowadzanie
    // lub qr code

    // config i porównanie

    // pobieranie danych:
    // - pytania
    // - zdjęcia

}