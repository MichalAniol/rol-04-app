import { add, remove, setStyle, boundRect, inner, display } from '../../dom'
import { elements } from './statistics'
import { data } from './data'
import { data as paramsData } from '../../engine/params'
import { core } from '../../core'
import { get as getIdToDate } from '../../utils/idToDate'
import { QuestionDbT } from '@/types'

let lastCell: number | null = null
const mousemove = ((event: MouseEvent) => {
    const pozX = event.clientX
    const pozY = event.clientY

    const monitorPos = boundRect(elements.monitor)

    const pxX = pozX - monitorPos.x
    const pxY = pozY - monitorPos.y

    const x = Math.floor(pxX / data.cell.all)
    const y = Math.floor(pxY / data.cell.all)

    const cellNum = x + (y * data.monitor.size)
    const cell = cellNum >= paramsData.sume ? null : cellNum

    const condition = data.monitor.width - 250 < pxX

    setStyle(elements.tooltip, 'left', `${pozX - (core.isMobile ? 0 : 200) + (condition ? (-8 - boundRect(elements.tooltip).width) : 16)}px`)
    setStyle(elements.tooltip, 'top', `${pozY + 16}px`)

    if (cell === null) {
        display(elements.tooltip, 'none')
        lastCell = -1
        return
    }

    if (cell !== lastCell) {
        lastCell = cell
        const answer = paramsData.answers[cell]
        if (!answer) {
            return
        }
        const question = paramsData.questions.find(q => q.id === answer.id) as QuestionDbT

        const usedList = [question.id, ...question.used]
        display(elements.tooltip, 'block')
        inner(elements.tooltip, `${getIdToDate(usedList)}`)
    }
}) as EventListenerOrEventListenerObject

const mouseleave = () => {
    display(elements.tooltip, 'none')
}

export const active = () => {
    if (!core.isMobile) {
        add(elements.monitor, 'mousemove', mousemove)
        add(elements.monitor, 'mouseleave', mouseleave)
    }
}

export const deactivate = () => {
    if (!core.isMobile) {
        remove(elements.monitor, 'mousemove', mousemove)
        remove(elements.monitor, 'mouseleave', mouseleave)
    }
}
