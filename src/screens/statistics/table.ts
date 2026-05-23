namespace statistics {
    export namespace legend {
        const { byQ, inner } = dom

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
            if (engine.params.data.answers === null) return

            const tableData = createTableData()
            const sumeMoreOne = engine.params.data.sume - engine.params.data.quantities[0]

            engine.params.data.answers.forEach(answer => {
                if (answer.used > 1) {
                    setValues(tableData.moreOne, answer)
                } else {
                    setValues(tableData.one, answer)
                }
                setValues(tableData.all, answer)
            })

            countPercent(tableData.all, tableData.allPercent, engine.params.data.sume)
            countPercent(tableData.moreOne, tableData.moreOnePercent, sumeMoreOne)
            countPercent(tableData.one, tableData.onePercent, engine.params.data.quantities[0])

            showTableData(tableData)
        }
    }
}