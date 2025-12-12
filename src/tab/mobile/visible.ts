namespace tab {
    export namespace mobile {
        const { setStyle } = dom

        type ElementsKeysT = Exclude<keyof ElementsT, 'items' | 'list'>;

        type VizElemValue = [keyof dom.ModifiableCSSProperties, string]
        type VizElemT = { [K in ElementsKeysT]: VizElemValue[] }

        const vizElem: VizElemT = {
            menu: [
                ['width', 'mobile_diameter'],
                ['height', 'mobile_diameter'],
                ['right', 'mobile_negative_radius'],
                ['bottom', 'mobile_negative_radius'],
            ],
            back: [
                ['width', 'mobile_back_diameter'],
                ['height', 'mobile_back_diameter'],
                ['bottom', 'mobile_negative_radius'],
                ['right', 'mobile_negative_radius'],
            ],
            dot: [
                ['width', 'mobile_dot'],
                ['height', 'mobile_dot'],
            ],
            iconHide: [
                ['bottom', 'mobile_icon_hide_pos'],
                ['right', 'mobile_icon_hide_pos'],
            ],
        }

        const setTypeValues = {
            on: '_on',
            off: '_off',
        } as const
        type SetTypeValuesT = typeof setTypeValues[keyof typeof setTypeValues]

        const getCssValue = (val: string, setType: SetTypeValuesT) => `var(--${val}${setType})`

        const set = (key: ElementsKeysT, val: [keyof dom.ModifiableCSSProperties, string], setType: SetTypeValuesT) => setStyle(elements[key], val[0], getCssValue(val[1], setType))

        const setOn = (key: ElementsKeysT, val: [keyof dom.ModifiableCSSProperties, string]) => set(key, val, setTypeValues.on)
        const setOff = (key: ElementsKeysT, val: [keyof dom.ModifiableCSSProperties, string]) => set(key, val, setTypeValues.off)

        const getShow = () => () => {
            Object.keys(vizElem).forEach((key: ElementsKeysT) => vizElem[key].forEach(val => setOn(key, val)))
            elements.items.forEach((item) => setStyle(item, 'top', 'var(--mobile_negative_radius_on)'))
            setStyle(elements.dot, 'backgroundColor', 'var(--mobile_color_prime)')
        }

        const getHide = () => () => {
            Object.keys(vizElem).forEach((key: ElementsKeysT) => vizElem[key].forEach(val => setOff(key, val)))
            elements.items.forEach((item) => setStyle(item, 'top', 'var(--mobile_negative_radius_off)'))
            setStyle(elements.dot, 'backgroundColor', 'var(--mobile_color_second)')
        }

        const show = getShow()
        const hide = getHide()

        let visible = true
        export const changeVisibility = () => {
            if (visible) {
                hide()
                visible = false
            } else {
                show()
                visible = true
            }
        }
    }
}