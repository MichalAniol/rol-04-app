
import { byId, getPx, setStyle } from '../dom'
import { error } from './error/error'
import { init as userInit } from './user/user'
import { init as installerInit } from './installer/installer'
import { init as infoInit } from './info/info'
import { areNotNull } from '@/utils/isNotNull'
import { blur, unBlur } from '@/tab/tab'

type ElementsT = {
    modal: HTMLElement
    back: HTMLElement
}

const elements = {} as ElementsT

export const init = () => {
    elements.modal = byId('modal') as HTMLElement
    elements.back = byId('modal-back') as HTMLElement
    areNotNull(elements, ['modal'])

    // const testBtn = byId('test-btn')
    // add(testBtn, 'click', () => {
    //     user.show()
    // })

    error.init()
    userInit()
    installerInit()
    infoInit()
}

export const resize = (w: number, h: number) => {
    setStyle(elements.back, 'width', getPx(w))
    setStyle(elements.back, 'height', getPx(h))
}

let visible = false

export const show = () => {
    visible = true
    setStyle(elements.modal, 'opacity', '0')
    setStyle(elements.modal, 'display', 'flex')
    setTimeout(() => {
        setStyle(elements.modal, 'opacity', '1')
    }, 30)
    blur()
}

export const hide = () => {
    visible = false
    setStyle(elements.modal, 'opacity', '0')
    setTimeout(() => {
        if (!visible) {
            setStyle(elements.modal, 'display', 'none')
        }
    }, 330)
    unBlur()
}
