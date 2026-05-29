import { elements } from './statistics'
import { byQ, inner } from '../../dom'
import { data as engineData } from '../../engine/params'
import { AnswersT, rating } from '@/types'

const colNames = ['good', 'bad', 'unused'] as const
const rowNames = ['all', 'allPercent', 'moreOne', 'moreOnePercent', 'one', 'onePercent'] as const

type RowT = { [K in typeof colNames[number]]: number }
type TableDataT = { [K in typeof rowNames[number]]: RowT }


const createTableData = () => {
    const data = {} as TableDataT

    for (const row of rowNames) {
        const rowObj = {} as RowT

        for (const col of colNames) {
            rowObj[col] = 0
        }

        data[row] = rowObj
    }
    return data
}

const setValues = (row: RowT, answer: AnswersT) => {
    if (answer.rating?.type === rating.bad) {
        row.bad++
    } else if (answer.rating?.type === rating.good) {
        row.good += (answer.rating.scale + 1) / 3
    } else {
        row.unused++
    }
}

const countPercent = (numRow: RowT, percRow: RowT, sum: number) => {
    (Object.keys(numRow) as (keyof RowT)[]).forEach((key) => {

        const num = numRow[key]
        percRow[key] = Math.round(sum === 0 ? 0 : (num / sum) * 1000) / 10
    })
}

const getElement = (row: string, col: string) => byQ(elements.table, `tr[data-row="${row}"] td[data-col="${col}"]`)

const showTableData = (data: TableDataT) => {
    const percentNames = ['allPercent', 'moreOnePercent', 'onePercent']

    for (const row of rowNames) {
        for (const col of colNames) {

            const value = data[row][col]
            const suffix = percentNames.some(pn => pn === row) ? '%' : ''
            const elem = getElement(row, col) as HTMLElement
            inner(elem, value.toFixed(1) + suffix)
        }
    }
}

export const setData = () => {
    if (engineData.answers === null) return

    const tableData = createTableData()
    const sumeMoreOne = engineData.sume - (engineData.quantities[0] as number)

    engineData.answers.forEach(answer => {
        if (answer.used > 1) {
            setValues(tableData.moreOne, answer)
        } else {
            setValues(tableData.one, answer)
        }
        setValues(tableData.all, answer)
    })

    countPercent(tableData.all, tableData.allPercent, engineData.sume)
    countPercent(tableData.moreOne, tableData.moreOnePercent, sumeMoreOne)
    countPercent(tableData.one, tableData.onePercent, engineData.quantities[0] as number)

    showTableData(tableData)
}
