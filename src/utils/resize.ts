namespace utils {
    export const resize = () => {
        const functionList: Function[] = []

        const add = (fn: (w: number, h: number) => void) => functionList.push(fn)

        const run = () => {
            const w = window.visualViewport.width
            const h = window.visualViewport.height

            functionList.forEach(f => f(w, h))
        }

        window.onresize = run

        return {
            add,
            run
        }
    }
}