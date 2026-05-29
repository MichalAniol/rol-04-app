export const resize = () => {
    const functionList: Function[] = []

    const add = (fn: (w: number, h: number) => void) => functionList.push(fn)

    const run = () => {
        const vv = window.visualViewport as VisualViewport
        const w = vv.width
        const h = vv.height

        functionList.forEach(f => f(w, h))
    }

    window.onresize = run

    return {
        add,
        run
    }
}