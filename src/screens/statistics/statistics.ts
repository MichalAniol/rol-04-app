namespace statistics {
    export const init = () => {
        engine.params.updateAnswers()
        draw.init()
    }

    export const resize = (w: number, h: number) => {
        draw.resize(w, h)
    }

    export const active = () => {
        draw.cells()
    }

    export const deactivate = () => { }
}