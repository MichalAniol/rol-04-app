import { byQuery, getPx, setStyle } from '../../dom'
import { init as infoInit, active as initActive, deactivate as infoDeactivate } from './info/info'
import { init as themeInit, ratio as themeRatio } from './theme/theme'
import { init as ratioInit, active as ratioActive, deactivate as ratioDeactivate } from './ratio/ratio'
import { init as optionsInit, active as optionsActive, deactivate as optionsDeactivate } from './options/options'
import { init as menuInit } from './menu/menu'
import { areNotNull } from '../../utils/isNotNull'
import * as testType from './testType/testType'

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
    ratioInit()
    menuInit()
    optionsInit()
    testType.init()
}

export const active = () => {
    initActive()
    themeRatio.active()
    ratioActive()
    optionsActive()
    testType.active()
}

export const deactivate = () => {
    infoDeactivate()
    themeRatio.deactivate()
    ratioDeactivate()
    optionsDeactivate()
    testType.deactivate()
}