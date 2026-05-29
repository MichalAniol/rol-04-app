export const shuffle = <T>(arr: T[]): T[] => {
    const shuffleOnce = (a: T[]) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = a[i]
            a[i] = a[j] as T
            a[j] = temp as T
        }
    }

    for (let k = 0; k < 3; k++) {
        shuffleOnce(arr)
    }

    return arr
}