
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

const getMonthAsNumber = (key: MonthKeys) => {
    const idToMonthNumber = {
        paz: '10',
        cze: '06',
        sty: '01',
        lut: '01',
        wrz: '09',
    }

    return idToMonthNumber[key]
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

const idToTimestamp = (id: string) => {
    const splittedId = id.split('-')
    const year = splittedId[0]
    const month = getMonthAsNumber(splittedId[1] as MonthKeys)

    const date = `${year}-${month}-01`
    return new Date(date).getTime()
}

export const getLatestTimestamp = (arr: string[]) => {
    let result = -Infinity
    arr.forEach(elem => {
        const stamp = idToTimestamp(elem)
        if (stamp > result) result = stamp
    })

    return result
}
