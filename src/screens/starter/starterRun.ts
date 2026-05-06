namespace starter {
    const { inner, setStyle, disable, enable } = dom

    const memoUserId = (userId: string) => {
        core.store.set(storageNames.userId, userId)
        dom.inner(elements.userId, userId)
    }

    const alphabetData = {
        azSmall: 'qwertyuiopasdfghjklzxcvbnm',
        azBig: 'QWERTYUIOPASDFGHJKLZXCVBNM',
        numbers: '1234567890',
    } as const
    const ALPHABET = alphabetData.numbers + alphabetData.azSmall + alphabetData.azBig
    const regex = new RegExp(`^[${ALPHABET}]{21}$`)

    export const run = async () => {
        // await queries.secure.getSecure()
        const secure = await queries.secure.getSecure()
        console.log('%c secure:', 'background:rgb(0, 42, 255); color: #003300', secure)

        if (secure.command === queries.responseCommand.secure.generateUserId) {
            // set new user
            const setNewUser = async () => {
                const userIdSet = await queries.user.set()
                memoUserId(userIdSet.userId)
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
                const userIdSet = await queries.user.checkId(input.value)
                console.log('%c userIdSet:', 'background: #ffcc00; color: #003300', userIdSet)
                const state = userIdSet.command
                const no = getNo(info, btn)

                if (state === queries.responseCommand.user.ok) {
                    memoUserId(input.value)
                    hide()
                } else {
                    no('Niema takiego użytkownika')
                }
            }

            modal.user.show(setNewUser, validateUserId, checkUserId)

            // setTimeout(async () => {
            //     const userIdSet = await queries.user.set()
            //     console.log('%c userIdSet:', 'background: #ffcc00; color: #003300', userIdSet)
            //     memoUserId(userIdSet.userId)
            // }, 300)
        } else if (secure.command === queries.responseCommand.secure.go) {
            memoUserId(secure.userId)
        }

        // const checkId = await queries.user.checkId('123456')
        // console.log('%c checkId:', 'background: #ffcc00; color: #003300', checkId)

        // console.log('%c secure:', 'background: #ffcc00; color: #003300', secure)

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