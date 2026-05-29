namespace utils {
    export namespace idToDate {
        type MonthKeys = 'paz' | 'cze' | 'sty' | 'wrz' | 'lut'
        const getMonth = (key: MonthKeys) => {
            const idToMonth = {
                paz: 'pazdziernik',
                cze: 'czerwiec',
                sty: 'styczeń',
                lut: 'styczeń',
                wrz: 'wrzesień',
            }

            return idToMonth[key]
        }

        const idToDate = (id: string) => {
            const splittedId = id.split('-')
            const year = splittedId[0]
            const month = getMonth(splittedId[1] as MonthKeys)

            return `${month} ${year}`
        }

        export const get = (ids: string[]) => {
            let result = ''
            ids.forEach((id, i, arr) => result += idToDate(id) + (i === arr.length - 1 ? '' : ', '))
            return result
        }
    }
}