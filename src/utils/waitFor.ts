namespace utils {
    export const waitFor = (condition: () => boolean, fn: () => void) => {
        const check = () => {
            setTimeout(() => {
                if (condition()) {
                    fn()
                    return
                }

                check()
            }, 100)
        }

        return check
    }
}