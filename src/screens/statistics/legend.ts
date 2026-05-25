namespace statistics {
    export namespace legend {
        const { prepare, setStyle } = dom

        type listElementsT = {
            bad: HTMLElement | null
            good: HTMLElement | null
            used: HTMLElement | null
        }

        const listElements: listElementsT = {
            bad: null,
            good: null,
            used: null,
        }

        const data = [
            { name: 'poprawne', id: 'good' },
            { name: 'nieużyte', id: 'used' },
            { name: 'błędne', id: 'bad' }
        ]

        const prepareColorLines = () => {
            elements.legend.replaceChildren()

            const children = [
                prepare('div', {
                    classes: ['statistics-box-title'],
                    inner: 'legenda'
                })
            ]

            const setLegendColors = (name: string, id: string) => {
                children.push(prepare('div', {
                    classes: ['statistics-colors-title'],
                    inner: name,
                }))

                const item = prepare('div', {
                    id: `statistics-${id}-colors`,
                    classes: ['statistics-section']
                })
                listElements[id as keyof listElementsT] = item as HTMLElement

                children.push(item)
            }

            data.forEach(item => setLegendColors(item.name, item.id))

            prepare(elements.legend, {
                children
            })
        }

        const setColorLine = (key: keyof GradientStepsT) => {
            const colors = statistics.data.steps[key]
            const parent = listElements[key]

            setTimeout(() => {
                colors.forEach((color, index) => {
                    const elem = prepare('div', {
                        classes: ['statistics-color'],
                    })
                    // legendItems.push(elem)
                    setStyle(elem, 'backgroundColor', color)
                    prepare(parent, { children: [elem] })

                    const p = prepare('p', {
                        inner: `${index + 1}x`
                    })
                    prepare(elem, { children: [p] })
                })
            }, 500)
        }

        export const setMonitorLegend = () => {
            prepareColorLines();
            (Object.keys(statistics.data.steps) as (keyof GradientStepsT)[]).forEach((key) => setColorLine(key))
        }
    }
}