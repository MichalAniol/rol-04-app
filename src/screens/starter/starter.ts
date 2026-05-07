namespace starter {
    type ElementsT = {
        logoDark: HTMLElement | null
        logoLight: HTMLElement | null
        svgTitle: SVGElement | null
        title_1: SVGTextContentElement | null
        title_2: SVGTextContentElement | null
        userLabel: SVGTextContentElement | null
        userId: SVGTextContentElement | null
        statusNow: SVGTextContentElement | null
        statusAction: SVGTextContentElement | null
        version: SVGTextContentElement | null
    }

    const { byId, add, getPx, setStyle, setAttribute } = dom

    export const elements: ElementsT = {
        logoDark: null,
        logoLight: null,
        svgTitle: null,
        title_1: null,
        title_2: null,
        userLabel: null,
        userId: null,
        statusNow: null,
        statusAction: null,
        version: null,
    }

    // czy połączenie z netem
    export const init = async () => {
        elements.logoDark = byId('logo-dark') as HTMLElement
        elements.logoLight = byId('logo-light') as HTMLElement
        elements.svgTitle = byId('starter-svg-title') as SVGElement
        elements.title_1 = byId('starter-title-1') as SVGTextContentElement
        elements.title_2 = byId('starter-title-2') as SVGTextContentElement
        elements.userLabel = byId('starter-user-label') as SVGTextContentElement
        elements.userId = byId('starter-user-id') as SVGTextContentElement
        elements.statusNow = byId('status-now') as SVGTextContentElement
        elements.statusAction = byId('status-action') as SVGTextContentElement
        elements.version = byId('starter-version') as SVGTextContentElement
    }


    export const resize = (w: number, h: number) => {
        const versionX = w - elements.version.getComputedTextLength() - 6 - (core.isMobile ? 0 : 200)
        const versionY = h - 6
        setAttribute(elements.version, 'x', `${getPx(versionX)}`)
        setAttribute(elements.version, 'y', `${getPx(versionY)}`)

        const svgHeight = `${getPx(h)}`

        const setTitleSize = (size: number) => {

            setStyle(elements.svgTitle, 'height', svgHeight)

            const fontSize = `${getPx(size)}`
            let y = size;
            [elements.title_1, elements.title_2].forEach(title => {
                setStyle(title, 'fontSize', fontSize)
                setStyle(title, 'lineHeight', fontSize)
                setAttribute(title, 'y', `${getPx(y)}`)
                y += size * 1.1
            });

            y += 50;
            [elements.userLabel, elements.userId].forEach(user => {
                setAttribute(user, 'y', `${getPx(y)}`)
                y += 24
            })

            y += 20;
            [elements.statusNow, elements.statusAction].forEach(status => {
                setAttribute(status, 'y', `${getPx(y)}`)
                y += 24
            })
        }

        const setLogoSize = (width: string, height: string) => {
            [elements.logoDark, elements.logoLight].forEach((elem) => {
                setStyle(elem, 'width', width)
                setStyle(elem, 'height', height)
            })
        }

        if (core.isMobile) {
            const fontSize = w / 7
            setTitleSize(fontSize)
            setLogoSize('100%', 'nope')
        } else {
            const fontSize = (w < h) ? w / 12 : h / 12
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

    



    export const active = () => { }

    export const deactivate = () => { }
}