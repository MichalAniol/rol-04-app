import { byId, setStyle, add, remove } from '../../../dom'
import { areNotNull } from '../../../utils/isNotNull'

const names = ['info', 'version', 'privacy-policy'] as const
type NameT = typeof names[number]

type ElementsGroupT = {
    base: HTMLElement
    more: HTMLElement
    less: HTMLElement
    content: HTMLElement
}

type ElementsT = Record<NameT, ElementsGroupT>
type ElementsKeysT = keyof ElementsT

const elements = {} as ElementsT

type ItemStateT = {
    height: number | null
    open: boolean
}

function fromNames<const T extends readonly string[], V>(
    names: T,
    createValue: (name: T[number]) => V,
): Record<T[number], V> {
    return Object.fromEntries(
        names.map(name => [name, createValue(name)]),
    ) as Record<T[number], V>
}

const state = fromNames(names, () => ({
    height: null,
    open: false,
} as ItemStateT))

type StateT = typeof state
type StateKeysT = keyof StateT

const stateNames = names

const clicks = fromNames(names, () => null as (() => void) | null)

type ClicksT = typeof clicks
type ClicksKeysT = keyof ClicksT

const clicksNames = names

const getElements = (name: string) => {
    return {
        base: byId(`settings-app-${name}-title`) as HTMLElement,
        more: byId(`settings-app-${name}-more`) as HTMLElement,
        less: byId(`settings-app-${name}-less`) as HTMLElement,
        content: byId(`settings-app-${name}-content`) as HTMLElement,
    } as ElementsGroupT
}

const initElements = (name: NameT) => {
    const content = elements[name as ElementsKeysT].content
    const contentBoxInfo = content.getBoundingClientRect()
    state[name].height = contentBoxInfo.height
    setStyle(elements[name as ElementsKeysT].less, 'display', 'none')
    setStyle(elements[name as ElementsKeysT].content, 'height', '0px')
}

const getClick = (name: string) => () => {
    if (state[name as StateKeysT].open) {
        setStyle(elements[name as ElementsKeysT].less, 'display', 'none')
        setStyle(elements[name as ElementsKeysT].more, 'display', 'initial')
        setStyle(elements[name as ElementsKeysT].content, 'height', '0px')
    } else {
        setStyle(elements[name as ElementsKeysT].less, 'display', 'initial')
        setStyle(elements[name as ElementsKeysT].more, 'display', 'none')
        setStyle(elements[name as ElementsKeysT].content, 'height', `${state[name as StateKeysT].height}px`)
    }
    state[name as StateKeysT].open = !state[name as StateKeysT].open
}

export const init = () => {
    names.forEach(name => {
        elements[name as ElementsKeysT] = getElements(name)
    })
    console.log('%c elements:', 'background: #ffcc00; color: #003300', elements)
    names.forEach((name) => areNotNull(elements, ['settings', `info.${name}`]))

    setTimeout(() => {
        stateNames.forEach(name => initElements(name))
    }, 100)

    clicksNames.forEach(clickName => {
        clicks[clickName as ClicksKeysT] = getClick(clickName)
    })
}

export const active = () => {
    stateNames.forEach(name =>
        add(elements[name as ElementsKeysT].base,
            'click',
            clicks[name as ClicksKeysT] as () => void
        )
    )
}

export const deactivate = () => {
    stateNames.forEach(name =>
        remove(
            elements[name as ElementsKeysT].base,
            'click',
            clicks[name as ClicksKeysT] as () => void
        )
    )
}