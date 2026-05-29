import { byId, getPx, setStyle, setAttribute } from '../../dom'
import { areNotNull } from '../../utils/isNotNull'
import { core } from '../../core'

type ElementsT = {
    logoDark: HTMLElement
    logoLight: HTMLElement
    svgTitle: SVGElement
    title_1: SVGTextContentElement
    title_2: SVGTextContentElement
    userLabel: SVGTextContentElement
    userId: SVGTextContentElement
    statusNow: SVGTextContentElement
    statusAction: SVGTextContentElement
    version: SVGTextContentElement
}

export const elements = {} as ElementsT

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

    areNotNull(elements, ['starter', 'screen'])
}


export const resize = (w: number, h: number) => {
    const menuH = (121 / 701) * w
    const versionX = w - elements.version.getComputedTextLength() - 6 - (core.isMobile ? 0 : 200)
    const versionY = h - 6 - (core.isMobile ? menuH : 0)
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

        y += 50

        setAttribute(elements.userLabel, 'y', `${getPx(y)}`)
        const correctW = core.isMobile ? w : w - 200
        const userIdSize = (correctW < h ? correctW : h) / 14
        y += userIdSize + 6
        setStyle(elements.userId, 'fontSize', `${getPx(userIdSize)}`);
        setAttribute(elements.userId, 'y', `${getPx(y)}`)

        y += 24 + 24;

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