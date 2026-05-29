import { changeVisibility } from '@/tab/simpleMenu/visible'
import { add } from '../dom'
import { goRight, goLeft } from '@/tab/tab'

const keysListener = (event: any) => {
    // console.log('%c event.code:', 'background: #ffcc00; color: #003300', event.code)
    switch (event.code) {
        case 'Tab': {
            event.preventDefault()      // blokuje defaultowe przenoszenie fokusu
        } break
        case 'Space': {
            // tab.mobile.changeVisibility()
            changeVisibility()
        } break
        case 'ArrowRight':
        case 'KeyD': {
            goRight()
            // console.log('goRight')
        } break
        case 'ArrowLeft':
        case 'KeyA': {
            goLeft()
            // console.log('goLeft')
        } break
    }
}

export const controllers = {
    keysListener,
    initKeys: () => {
        add(document, 'keydown', keysListener)
    }
}