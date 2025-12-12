namespace settings {
    const { root } = dom

    export namespace theme {
        const themeKind = {
            dark: 'dark',
            light: 'light',
            system: 'system'
        } as const

        type ThemeColorsT = typeof themeKind.dark | typeof themeKind.light

        // @ts-ignore
        const themeNames = Object.values(themeKind) as const

        const apply = (theme: ThemeColorsT) => {
            root.setAttribute('data-theme', theme)

            root.classList.remove(themeKind.dark, themeKind.light)
            root.classList.add(theme)

            root.style.colorScheme = theme
        }

        const setSystemTheme = () => {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            apply(systemPrefersDark ? themeKind.dark : themeKind.light)
        }

        const set = (saved: string) => {
            if (saved === themeKind.dark || saved === themeKind.light) {
                apply(saved)
                return saved
            }
            if (saved === themeKind.system) {
                setSystemTheme()
                return saved
            }

            core.store.set(storageNames.theme, themeKind.system)
            setSystemTheme()

            return themeKind.system
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