namespace controllers {
    const { add } = dom

    const keysListener = (event: any) => {
        console.log('%c event.code:', 'background: #ffcc00; color: #003300', event.code)
        switch (event.code) {
            case 'Tab': {
                event.preventDefault()      // blokuje defaultowe przenoszenie fokusu
            } break
            case 'Space': {
                tab.mobile.changeVisibility()
            } break
            case 'ArrowRight':
            case 'KeyD': {
                tab.goRight()
                // console.log('goRight')
            } break
            case 'ArrowLeft':
            case 'KeyA': {
                tab.goLeft()
                // console.log('goLeft')
            } break
        }
    }

    export const initKeys = () => {
        // add(document, 'keydown', keysListener)
        document.addEventListener('keydown', keysListener)
    }
}