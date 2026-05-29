import { setStyle, display, getPx, inner, boundRect } from '../../dom'
import { elements } from './learning'
import { mark } from './evaluation'
import { core } from '../../core'
import { ImageDbT, LearningT } from '@/types'
import { getItem } from '../../engine/run'
import { get as idToDateGet } from '../../utils/idToDate'
import { shuffle } from '@/utils/shuffle'


export type ShuffledT = {
    content: string,
    correct: boolean,
    number: number,
}

type EngineAnswersT = {
    origin: LearningT | null,
    shuffled: ShuffledT[]
}

type DataT = {
    mark: number,
    confirm: boolean,
    tabH: number,
    answers: EngineAnswersT
}

export const data: DataT = {
    mark: 0,
    confirm: false,
    tabH: 0,
    answers: {
        // origin: null,
        // shuffled: [],
    }
} as DataT

export const setSheetHight = () => {
    setStyle(elements.separator, 'height', ``)
    setStyle(elements.sheet, 'height', ``)
    setStyle(elements.sheet, 'opacity', `0`)
    // setStyle(elements.measure, 'height', ``)
    setTimeout(() => {
        const vv = window.visualViewport as VisualViewport
        const menuH = core.isMobile ? (121 / 701) * vv.width : 0
        const sheetH = boundRect(elements.measure).height - menuH

        const condition = sheetH < data.tabH - menuH - 60
        setStyle(elements.bottom, 'height', getPx(menuH + (condition ? 0 : 80)))

        // const scroll = vv.height * .2
        const separatorH = condition ? getPx(data.tabH - sheetH - 80) : ''
        // elements.sheet.scrollTop = scroll

        setStyle(elements.separator, 'height', separatorH)
        setStyle(elements.sheet, 'opacity', `1`)
    }, 300)
}

export const setQuestion = async () => {
    const item = await getItem()

    if (item.question.img) {
        const imgData = await core.idb.images.get(item.question.img)

        if (imgData === null) {
            setQuestion()
            return
        }
    }

    data.answers.origin = item
    mark(-1)()
    setStyle(elements.sheet, 'opacity', `0`)

    // pytanie info
    setTimeout(() => {
        const usedList: string[] = [item.question.id]
        item.question.used.forEach((u: string) => usedList.push(u))

        setTimeout(() => {
            inner(elements.info, `nazwa: <b>${item.question.id}</b><br><br>wystąpiło <b>${usedList.length}x</b> w: ${idToDateGet(usedList)}.`)
        }, 100)
    }, 100)

    // obrazek
    if (item.question.img) {
        display(elements.img, 'block')
        const imgData = await core.idb.images.get(item.question.img) as ImageDbT
        elements.drawImage.draw(imgData.data)
    } else {
        display(elements.img, 'none')
    }

    // opowiedzi
    inner(elements.question, item.question.question)
    const answers: ShuffledT[] = [{
        content: item.question.answer,
        correct: true,
        number: -1
    }]
    item.question.falseAnswers.forEach((falseAnswer: string, index: number) => {
        answers.push({
            content: falseAnswer,
            correct: false,
            number: index
        })
    })
    data.answers.shuffled = shuffle(answers)
    elements.answers.forEach((a, i) => {
        inner(a, (data.answers.shuffled[i] as ShuffledT).content as string)
    })
    elements.answersFields.forEach((a) => {
        setStyle(a, 'color', 'var(--prime_color)')
    })

    setSheetHight()
}

