namespace starter {
    type ElementsT = {
        logoDark: HTMLElement | null
        logoLight: HTMLElement | null
        title_1: HTMLElement | null
        title_2: HTMLElement | null
    }

    const { byId, add, getPx, setStyle } = dom

    const elements: ElementsT = {
        logoDark: null,
        logoLight: null,
        title_1: null,
        title_2: null,
    }

    // czy połączenie z netem
    export const init = async () => {
        elements.logoDark = byId('logo-dark')
        elements.logoLight = byId('logo-light')
        elements.title_1 = byId('starter-title-1')
        elements.title_2 = byId('starter-title-2')
    }


    export const resize = (w: number, h: number) => {

        const setTitleSize = (size: string) => {
            setStyle(elements.title_1, 'fontSize', size)
            setStyle(elements.title_1, 'lineHeight', size)
            setStyle(elements.title_2, 'fontSize', size)
            setStyle(elements.title_2, 'lineHeight', size)
        }

        const setLogoSize = (width: string, height: string) => {
            [elements.logoDark, elements.logoLight].forEach((elem) => {
                setStyle(elem, 'width', width)
                setStyle(elem, 'height', height)
            })
        }

        if (core.isMobile) {
            const fontSize = `${getPx(w / 7)}`
            setTitleSize(fontSize)
            setLogoSize('100%', 'nope')
        } else {
            const fontSize = (w < h) ? `${getPx(w / 12)}` : `${getPx(h / 12)}`
            setTitleSize(fontSize)

            if (w < h) {
                setLogoSize('100%', 'nope')
            } else {
                const scaledH = h * 0.6
                const height = `${scaledH}px`
                const ratio = 270.9 / 289.7
                const width = `${scaledH * ratio}px`

                setLogoSize(width, height)
            }
        }
    }

    export const run = async () => {
        // const userId = 


        const secure = await queries.secure.getSecure()
        console.log('%c secure:', 'background:rgb(0, 42, 255); color: #003300', secure)

        if (secure.command === queries.responseCommand.secure.generateUserId) {
            // modal.user.show()




            setTimeout(async () => {
                const userId = await queries.user.set()
                console.log('%c set user:', 'background: #ffcc00; color: #003300', userId)
            }, 300)
        } else {

        }

        console.log('%c secure:', 'background: #ffcc00; color: #003300', secure)

        if (secure === null) {

        }
    }

    // czy nowy użytkownik
    // jak nie to wprowadzanie
    // lub qr code

    // config i porównanie

    // pobieranie danych:
    // - pytania
    // - zdjęcia



    export const active = () => { }

    export const deactivate = () => { }
}