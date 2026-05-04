namespace settings {
    const { root, setAttribute, setStyle, removeClass, addClass } = dom

    export namespace theme {
        export const theme = {
            dark: 'dark',
            light: 'light',
        } as const

        type ThemeT = keyof typeof theme
        type ThemeValuesT = typeof theme[ThemeT]

        export const themeMode = {
            ...theme,
            system: 'system',
        } as const

        // @ts-ignore
        const themeNames = Object.values(themeMode) as const

        type MemoT = { theme: ThemeValuesT | null }
        const memo: MemoT = {
            theme: null
        }

        export const get = () => memo.theme

        const apply = (theme: ThemeValuesT) => {
            root.setAttribute('data-theme', theme)
            setAttribute(root, 'data-theme', theme)

            removeClass(root, themeMode.dark)
            removeClass(root, themeMode.light)
            addClass(root, theme)

            setStyle(root, 'colorScheme', theme)
        }

        const setSystemTheme = () => {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const newTheme = systemPrefersDark ? theme.dark : theme.light
            apply(newTheme)
            memo.theme = newTheme
        }

        const set = (saved: string) => {
            if (saved === theme.dark || saved === theme.light) {
                apply(saved)
                return saved
            }
            if (saved === themeMode.system) {
                setSystemTheme()
                return saved
            }

            core.store.set(storageNames.theme, themeMode.system)
            setSystemTheme()

            return themeMode.system
        }

        const themeData = {
            prefix: 'setting-theme-',
            storeName: storageNames.theme,
            elementList: themeNames,
            nameList: themeNames,
            clickList: themeNames.map((name, i) => () => set(name)),
            init: set,
        }

        export let ratio: RatioT
        export const init = async () => {
            ratio = utils.getRadio(themeData)
            ratio.init()
        }
    }
}