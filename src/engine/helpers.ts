namespace engine {
    export namespace helpers {
        export const getDateAtNoonInXDays = (daysPlus: number, date?: number): number => {
            const newDate = date ? new Date(date) : new Date()

            const targetDate = new Date(
                newDate.getFullYear(),
                newDate.getMonth(),
                newDate.getDate() + daysPlus,
                12, 0, 0, 0
            )

            return targetDate.getTime()
        }

        export const generateTriangularSequence = (length: number) => {
            const result: number[] = []
            let n = 1, current = 0

            for (let i = 0; i < length; i++) {
                current += n;
                result.push(current)
                n++
            }

            return result
        }
    }
}