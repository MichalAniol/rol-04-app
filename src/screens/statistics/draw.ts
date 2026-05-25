namespace statistics {
    export namespace draw {
        const { getColorFromStyle } = dom

        const getMetrics = () => {
            const halfSpace = data.cell.space / 2
            const offset = data.cell.space + halfSpace
            const smallRect = data.cell.size - (offset * 2)

            return {
                twoPi: Math.PI * 2,
                halfSpace,
                offset,
                smallRect,
                center: data.cell.size / 2,
                quarter: data.cell.size / 4,
            }
        }

        export const themeChange = () => {
            data.background = getColorFromStyle('--last_color')

            data.base.used.min = getColorFromStyle('--mine_6_color')
            data.base.used.max = getColorFromStyle('--mine_color')
            data.steps.used = helpers.getColorSteps(data.base.used.min, data.base.used.max, engine.params.data.quantities.length)

            data.base.bad.min = getColorFromStyle('--off_second_color')
            data.base.bad.max = getColorFromStyle('--off_prime_color')
            data.steps.bad = helpers.getColorSteps(data.base.bad.min, data.base.bad.max, engine.params.determinants.numLastRequiredQuestions)

            data.base.good.min = getColorFromStyle('--on_second_color')
            data.base.good.max = getColorFromStyle('--on_prime_color')
            data.steps.good = helpers.getColorSteps(data.base.good.min, data.base.good.max, engine.params.determinants.numLastHighlyRatedQuestions)
        }

        // const testIds = () => {
        //     const answers = engine.params.data.answers
        //     const tested: AnswersT[] = []
        //     answers.forEach(a => {
        //         const notUnique = tested.some(t => t.id === a.id)
        //         if (notUnique) {
        //             console.log('%c notUnique:', 'background:rgb(255, 81, 0); color: #003300', a.id)
        //         } else {
        //             tested.push(a)
        //         }
        //     })

        //     console.log('%c tested:', 'background: #ffcc00; color: #003300', tested.length)
        // }

        export const cells = async () => {
            elements.ctx.clearRect(0, 0, elements.monitor.width, elements.monitor.height)

            const { twoPi, offset, smallRect, center, quarter } = getMetrics()

            const answers = engine.params.data.answers
            if (answers === null) return

            answers.forEach((answer, index) => {
                const pozX = (index % data.monitor.size) * (data.cell.size + data.cell.space)
                const pozY = Math.floor(index / data.monitor.size) * (data.cell.size + data.cell.space)

                elements.ctx.fillStyle = helpers.getColor(answer)
                elements.ctx.fillRect(pozX, pozY, data.cell.size, data.cell.size)

                // zaznacza obecną sesję
                const onThisSession = helpers.getOnThisSession(answer)
                if (onThisSession) {
                    elements.ctx.strokeStyle = data.background // REVIEW - 
                    elements.ctx.lineWidth = data.cell.space // REVIEW - 

                    const sesX = pozX + offset
                    const sesY = pozY + offset
                    const sesSize = smallRect

                    elements.ctx.strokeRect(sesX, sesY, sesSize, sesSize)
                }

                // zaznacza obecnie wyświetlane pytanie
                if (learning.data.answers.origin?.answer) {
                    const condition = learning.data.answers.origin.answer.id === answer.id
                    if (condition) {
                        elements.ctx.fillStyle = data.background // REVIEW - 

                        const nowX = pozX + center
                        const nowY = pozY + center

                        elements.ctx.beginPath()
                        elements.ctx.arc(nowX, nowY, quarter, 0, twoPi)
                        elements.ctx.fill()
                    }
                }
            })
        }

        export const init = () => {
            utils.waitFor(() => engine.params.data.sume !== 0, () => {
                themeChange()
                resize(window.visualViewport.width, window.visualViewport.height)
            })()
        }

        export const resize = (w: number, h: number) => {
            const bit = data.monitor.width / ((determinants.cell.size * data.monitor.size) + (determinants.cell.space * (data.monitor.size - 1)))
            data.cell.size = determinants.cell.size * bit
            data.cell.space = determinants.cell.space * bit

            elements.monitor.width = data.monitor.width
            elements.monitor.height = data.monitor.width

            cells()
        }
    }
}