namespace cookie {
    export const names = {
        userId: 'user-id',
        test: 'test',
    } as const

    type NameKeysT = keyof typeof names
    type NamesValuesT = typeof names[NameKeysT]

    const namesValues = Object.values(names) as Array<NamesValuesT>;

    export const get = (name: NamesValuesT) => {
        const nameIsOk = namesValues.some((n) => n === name)

        if (nameIsOk) {
            const cookies = document.cookie.split('; ')
            console.log('%c cookies:', 'background: #ffcc00; color: #003300', cookies)

            for (const cookie of cookies) {
                const [key, value] = cookie.split('=')
                if (key === name) {
                    return decodeURIComponent(value)
                }
            }

            return undefined
        }

        return null
    }
}