type RadioDataT = {
    prefix: string
    storeName: DataNamesKeysT
    list: string[]
    clickList: (() => void)[]
}

namespace utils {
    const { byId, byQ, add, remove } = dom

    export const getRadio = (radioData: RadioDataT) => {

        // @ts-ignore
        const themeElements = radioData.list.map(tn => byId(radioData.prefix + tn)) as const
        console.log('%c themeElements:', 'background: #ffcc00; color: #003300', themeElements)

        type RadioListItemT = {
            item: HTMLElement
            click: () => void
            checkbox?: HTMLInputElement
            name?: string
        }

        const newRadioData: RadioListItemT[] = []
        const shift = (num: number) => newRadioData.forEach((rd, i) => rd.checkbox.checked = i === num)

        radioData.list.forEach((name, i) => {
            newRadioData.push({
                item: themeElements[i] as HTMLElement,
                click: () => {
                    radioData.clickList[i]()
                    core.store.set(radioData.storeName, name)
                    shift(i)
                },
                checkbox: byQ(themeElements[i], 'input') as HTMLInputElement,
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
            mark(saved)
            return saved
        }

        return {
            init,
            active,
            deactivate,
        }
    }
}