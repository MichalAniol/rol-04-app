import { byQuery, getPx, setStyle } from '../../dom'
import { init as infoInit, active as initActive, deactivate as infoDeactivate } from './info/info'
import { init as themeInit, ratio } from './theme/theme'
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
    ratio.init()
    // dataControl.init()
    menuInit()
}

export const active = () => {
    initActive()
    ratio.active()
    ratio.active()
    // dataControl.questionsRatio.active()
    // dataControl.imgRatio.active()
}

export const deactivate = () => {
    infoDeactivate()
    ratio.deactivate()
    ratio.deactivate()
    // dataControl.questionsRatio.deactivate()
    // dataControl.imgRatio.deactivate()
}