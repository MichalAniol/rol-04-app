namespace statistics {
    export namespace draw {
        const { byId, prepare, getColorFromStyle } = dom

        type ElementsT = {
            monitor: HTMLCanvasElement | null,
            ctx: CanvasRenderingContext2D | null,
        }

        const elements: ElementsT = {
            monitor: null,
            ctx: null,
        }

        export const themeChange = () => {
            data.base.used.min = getColorFromStyle('--mine_6_color')
            data.base.used.max = getColorFromStyle('--mine_color')
            data.steps.used = helpers.getColorSteps(data.base.used.min, data.base.used.max, engine.params.data.quantities.length)

            data.base.bad.min = getColorFromStyle('--off_second_color')
            data.base.bad.max = getColorFromStyle('--off_prime_color')
            data.steps.bad = helpers.getColorSteps(data.base.bad.min, data.base.bad.max, engine.params.determinants.numLastRequiredQuestions)

            data.base.good.min = getColorFromStyle('--on_second_color')
            data.base.good.max = getColorFromStyle('--on_prime_color')
            data.steps.good = helpers.getColorSteps(data.base.good.min, data.base.good.max, engine.params.determinants.numLastHighlyRatedQuestions - engine.params.determinants.numLastRequiredQuestions)
        }

        export const cells = async () => {
            const answers = engine.params.data.answers
            if (answers === null) return

            // mCtx.fillStyle = 'rgb(71, 98, 215)'

            answers.forEach((answer, index) => {
                const pozX = (index % data.monitor.size) * (data.cell.size + data.cell.space)
                const pozY = Math.floor(index / data.monitor.size) * (data.cell.size + data.cell.space)

                const color = helpers.getColor(answer)
                console.log('%c color:', 'background: #ffcc00; color: #003300', color)
                elements.ctx.fillStyle = color
                elements.ctx.fillRect(pozX, pozY, data.cell.size, data.cell.size)
            })
        }

        export const init = () => {
            elements.monitor = byId('statistics-monitor') as HTMLCanvasElement
            elements.ctx = elements.monitor.getContext("2d")

            utils.areNotNull(elements, ['screens', 'drawing'])

            setTimeout(() => {
                themeChange()
                resize(window.visualViewport.width, window.visualViewport.height)
            }, 300)
        }

        export const resize = (w: number, h: number) => {
            data.monitor.width = w - 40
            const bit = data.monitor.width / ((determinants.cell.size * data.monitor.size) + (determinants.cell.space * (data.monitor.size - 1)))
            data.cell.size = determinants.cell.size * bit
            data.cell.space = determinants.cell.space * bit

            elements.monitor.width = data.monitor.width
            elements.monitor.height = data.monitor.width

            cells()
        }







        // const drawCells = () => {



        //     let sessionIndex = 0
        //     // zaznacza pytania użyte w danej sesji
        //     const markCells = (data: TensorDataT[]) => {
        //         sessionIndex++

        //         mCtx.lineWidth = 2
        //         mCtx.strokeStyle = 'rgb(216, 19, 19)'

        //         const oldSessionBox = byId('session-box') as HTMLDivElement
        //         if (oldSessionBox) prepare(oldSessionBox, { delete: true })

        //         const sessionBox = prepare('div', { id: 'session-box' })
        //         prepare(session, { children: [sessionBox] })

        //         prepare(sessionTitle, { inner: `Session: ${sessionIndex}` })

        //         const children: (HTMLElement | HTMLImageElement)[] = []
        //         data.forEach((d) => {
        //             const pozX = (d.i % table.width) * (cell.width + cell.space)
        //             const pozY = Math.floor(d.i / table.width) * (cell.height + cell.space)

        //             mCtx.beginPath()
        //             mCtx.rect(pozX + 2, pozY + 2, cell.width - 4, cell.height - 4)
        //             mCtx.stroke()

        //             children.push(
        //                 prepare('div', {
        //                     classes: ['session-item'],
        //                     inner: `question-${d.id}`
        //                 })
        //             )
        //         })
        //         prepare(sessionBox, { children })
        //     }
    }
}