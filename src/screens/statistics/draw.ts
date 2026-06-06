
import { getColorFromStyle, boundRect } from '../../dom'
import { data, determinants } from './data'
import { elements } from './statistics'
import { getColorSteps, getColorForThree, getOnThisSession, getColorFroOne } from './helpers'
import { data as paramsData, determinants as engineDeterminants } from '../../engine/params'
import { data as learningData } from '../learning/preparation'
import { waitFor } from '@/utils/waitFor'
import { core } from '@/core'
import { learningType, storageNames } from '@/storage'

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
    data.steps.used = getColorSteps(data.base.used.min, data.base.used.max, paramsData.quantities.length)

    data.base.bad.min = getColorFromStyle('--off_second_color')
    data.base.bad.max = getColorFromStyle('--off_prime_color')
    data.steps.bad = getColorSteps(data.base.bad.min, data.base.bad.max, engineDeterminants.numLastRequiredQuestions)

    data.base.good.min = getColorFromStyle('--on_second_color')
    data.base.good.max = getColorFromStyle('--on_prime_color')
    data.steps.good = getColorSteps(data.base.good.min, data.base.good.max, engineDeterminants.numLastHighlyRatedQuestions)
}

// const testIds = () => {
//     const answers = paramsData.answers
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

    const answers = paramsData.answers
    if (answers === null) return

    const learningVisualizationType = core.store.get(storageNames.learningVisualizationType)
    console.log('%c learningVisualizationType:', 'background: #ffcc00; color: #003300', learningVisualizationType)

    answers.forEach((answer, index) => {
        const pozX = (index % data.monitor.size) * (data.cell.size + data.cell.space)
        const pozY = Math.floor(index / data.monitor.size) * (data.cell.size + data.cell.space)

        // TODO - rating
        if (learningVisualizationType === learningType.upToThree) {
            elements.ctx.fillStyle = getColorForThree(answer)
        } else {
            elements.ctx.fillStyle = getColorFroOne(answer)
        }

        elements.ctx.fillRect(pozX, pozY, data.cell.size, data.cell.size)

        // zaznacza obecną sesję
        const onThisSession = getOnThisSession(answer)
        if (onThisSession) {
            elements.ctx.strokeStyle = data.background
            elements.ctx.lineWidth = data.cell.space
            const sesX = pozX + offset
            const sesY = pozY + offset
            const sesSize = smallRect

            elements.ctx.strokeRect(sesX, sesY, sesSize, sesSize)
        }

        // zaznacza obecnie wyświetlane pytanie
        if (learningData.answers.origin?.answer) {
            const condition = learningData.answers.origin.answer.id === answer.id
            if (condition) {
                elements.ctx.fillStyle = data.background
                const nowX = pozX + center
                const nowY = pozY + center

                elements.ctx.beginPath()
                elements.ctx.arc(nowX, nowY, quarter, 0, twoPi)
                elements.ctx.fill()
            }
        }

        // oznaczenie "dotkniętych" pytań
        if (process.env.DEBUG === "true") {
            if (answer.history.length > 0) {
                elements.ctx.fillStyle = data.background
                elements.ctx.lineWidth = data.cell.space

                const endX = pozX + data.cell.size - (data.cell.space * 3)
                const endY = pozY + data.cell.size - (data.cell.space * 3)

                elements.ctx.beginPath()
                elements.ctx.moveTo(pozX + (data.cell.space * 3), pozY + (data.cell.space * 3))
                elements.ctx.lineTo(endX, endY)
                elements.ctx.stroke()
            }
        }
    })
}

export const init = () => {
    waitFor(() => paramsData.sume !== 0, () => {
        themeChange()
        const vv = window.visualViewport as VisualViewport
        resize(vv.width, vv.height)
    })()
}

// @ts-ignore
export const resize = (w: number, h: number) => {
    const bit = data.monitor.width / ((determinants.cell.size * data.monitor.size) + (determinants.cell.space * (data.monitor.size - 1)))
    data.cell.size = determinants.cell.size * bit
    data.cell.space = determinants.cell.space * bit
    data.cell.all = data.cell.size + data.cell.space

    elements.monitor.width = data.monitor.width
    elements.monitor.height = data.monitor.width

    const monitorPos = boundRect(elements.monitor)
    data.monitor.pos.x = monitorPos.x
    data.monitor.pos.y = monitorPos.y

    cells()
}
