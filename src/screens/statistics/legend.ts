import { prepare, setStyle } from '../../dom'
import { elements } from './statistics'
import { GradientStepsT, data as statisticsData } from './data'

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
    ] as HTMLElement[]

    const setLegendColors = (name: string, id: string) => {
        children.push(prepare('div', {
            classes: ['statistics-colors-title'],
            inner: name,
        }) as HTMLElement)

        const item = prepare('div', {
            id: `statistics-${id}-colors`,
            classes: ['statistics-section']
        })
        listElements[id as keyof listElementsT] = item as HTMLElement

        children.push(item as HTMLElement)
    }

    data.forEach(item => setLegendColors(item.name, item.id))

    prepare(elements.legend, {
        children
    })
}

const setColorLine = (key: keyof GradientStepsT) => {
    const colors = statisticsData.steps[key]
    const parent = listElements[key] as HTMLElement

    setTimeout(() => {
        colors.forEach((color, index) => {
            const elem = prepare('div', {
                classes: ['statistics-color'],
            }) as HTMLElement
            // legendItems.push(elem)
            setStyle(elem, 'backgroundColor', color)
            prepare(parent, { children: [elem] })

            const p = prepare('p', {
                inner: `${index + 1}x`
            }) as HTMLElement
            prepare(elem, { children: [p] })
        })
    }, 500)
}

export const setMonitorLegend = () => {
    prepareColorLines();
    (Object.keys(statisticsData.steps) as (keyof GradientStepsT)[]).forEach((key) => setColorLine(key))
}
