import { byId, byQ, add, remove } from '../dom'
import { core } from '../core'
import { DataNamesValuesT } from '@/storage'


export type RadioDataT = {
    prefix: string
    storeName: DataNamesValuesT
    elementList: string[]
    nameList: string[]
    clickList: (() => void)[]
    init?: (saved: string) => string
}

export type RatioT = {
    init: () => void
    active: () => void
    deactivate: () => void
}

export const getRadio = (radioData: RadioDataT) => {

    // @ts-ignore
    const themeElements = radioData.elementList.map(tn => byId(radioData.prefix + tn)) as const

    type RadioListItemT = {
        item: HTMLElement
        click: () => void
        checkbox: HTMLInputElement
        name?: string
    }

    const newRadioData: RadioListItemT[] = []
    const shift = (num: number) => newRadioData.forEach((rd, i) => rd.checkbox.checked = i === num)

    radioData.nameList.forEach((name, i) => {
        const click = radioData.clickList && radioData.clickList[i] ? () => {
            const fn = radioData.clickList[i] as (() => void)
            fn()
            core.store.set(radioData.storeName, name)
            shift(i)
        } : () => {
            core.store.set(radioData.storeName, name)
            shift(i)
        }

        const elem = themeElements[i] as HTMLElement
        newRadioData.push({
            item: elem,
            click,
            checkbox: byQ(elem, 'input') as HTMLInputElement,
            name: name,
        })
    })

    const getSaved = () => core.store.get(radioData.storeName)

    const mark = (name: string) => newRadioData.forEach(rd => rd.checkbox.checked = rd.name === name)

    const active = () => newRadioData.forEach(rd => add(rd.item, 'click', rd.click))

    const deactivate = () => newRadioData.forEach(rd => remove(rd.item, 'click', rd.click))

    const init = () => {
        active()
        const saved = getSaved()
        if (radioData.init) radioData.init(saved as string)
        mark(saved as string)
        return saved
    }

    return {
        init,
        active,
        deactivate,
    } as RatioT
}
