namespace tab {
    export namespace mobile {
        export namespace touch {

            const { byId, byQAll, getPx, setStyle, add } = dom


            const state = {
                pivot: {
                    x: 0,
                    y: 0,
                },
                start: {
                    x: 0,
                    y: 0,
                },
                originAngle: 0,
                startAngle: 0,
                angle: 0,
            }

            export const resize = () => {
                const menu = elements.menu.getBoundingClientRect()
                const r = menu.width / 2

                state.pivot.x = menu.left + r
                state.pivot.y = menu.top + r

                console.log('%c state:', 'background: #ffcc00; color: #003300', state.pivot)
            }

            const setDeg = () => {
                const style = window.getComputedStyle(elements.list)
                const transform = style.transform;
                const values = transform.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(v => parseFloat(v))

                if (values) {
                    const [a, b, c, d] = values
                    const angleRad = Math.atan2(b, a)
                    const angleDeg = angleRad * 180 / Math.PI
                    state.originAngle = angleDeg
                }
            }

            const getDeg = () => `rotate(${(state.originAngle + state.angle - state.startAngle)}deg)`

            const rotate = () => {
                setStyle(elements.list, 'transform', getDeg())
            }

            const getAngle = (dx: number, dy: number) => Math.atan2(dx, -dy) * 180 / Math.PI

            const touchstart = (e: TouchEvent) => {
                const t = e.touches[0]
                state.start.x = t.clientX
                state.start.y = t.clientY

                const dx = state.start.x - state.pivot.x
                const dy = state.start.y - state.pivot.y

                state.startAngle = getAngle(dx, dy)

                setDeg()
            }

            const touchmove = (e: TouchEvent) => {
                const t = e.touches[0]
                const x = t.clientX
                const y = t.clientY

                const dx = x - state.pivot.x
                const dy = y - state.pivot.y

                state.angle = getAngle(dx, dy)

                rotate()
            }

            const touchend = (e: TouchEvent) => {
                const t = e.changedTouches[0]
                const x = t.clientX
                const y = t.clientY

                console.log(x, y)
            }

            export const init = () => {
                add(elements.menu, 'touchstart', touchstart)
                add(elements.menu, 'touchmove', touchmove)
                add(elements.menu, 'touchend', touchend)
            }
        }
    }
}