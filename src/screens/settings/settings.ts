import { byQuery, getPx, setStyle } from '../../dom'
import { init as infoInit, active as initActive, deactivate as infoDeactivate } from './info/info'
import { init as themeInit, ratio as themeRatio } from './theme/theme'
import { init as ratioInit, active as ratioActive, deactivate as ratioDeactivate } from './ratio/ratio'
import { init as menuInit } from './menu/menu'
import { areNotNull } from '../../utils/isNotNull'

type ElementsT = {
    scrollBox: HTMLElement
}

const elements = {} as ElementsT

// @ts-ignore
export const resize = (w: number, h: number) => {
    setStyle(elements.scrollBox, 'height', `calc(${getPx(h)} - 32px - var(--font_title_size))`)
}

export const init = () => {
    elements.scrollBox = byQuery('#settings-tab-box .scroll-box') as HTMLElement
    areNotNull(elements, ['settings'])

    infoInit()
    themeInit()
    // themeRatio.init()
    ratioInit()
    // dataControl.init()
    menuInit()
}

export const active = () => {
    initActive()
    themeRatio.active()
    ratioActive()
    // dataControl.questionsRatio.active()
    // dataControl.imgRatio.active()
}

export const deactivate = () => {
    infoDeactivate()
    themeRatio.deactivate()
    ratioDeactivate()
    // dataControl.questionsRatio.deactivate()
    // dataControl.imgRatio.deactivate()
}