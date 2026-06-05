
import { setStyle, inner, disable, enable } from '../../dom'
import { data, setQuestion, ShuffledT } from './preparation'
import { elements } from './learning'
import { core } from '../../core'
import { determinants } from '../../engine/params'
import { HistoryT, LearningT, rating, RatingT } from '@/types'
import { get as settingsThemeGet, theme as themeOrigin } from '../settings/theme/theme'
import { addBad, addGood } from './startEnd'

export const mark = (num: number) => () => {
    if (data.confirm) {
        return
    }

    if (num === -1) {
        disable(elements.confirm)
    } else {
        enable(elements.confirm)
    }
    if (process.env.DEBUG === "true") {
        elements.confirm.focus()
    }

    data.mark = num
    // console.log('%c data.mark:', 'background:rgb(0, 34, 255); color: #003300', data.mark)
    elements.checkbox.forEach((a, i) => a.checked = (i === num))
    elements.answersFields.forEach((a, i) => i === num ? setStyle(a, 'border', '2px solid var(--mine_color)') : setStyle(a, 'border', '2px solid transparent'))
}

type ResultT = {
    good: number
    bad: number
}

const setResult = (result: ResultT, history: HistoryT[]) => {
    history.forEach(h => {
        if (h.result) {
            result.good++
        } else {
            result.bad++
        }
    })
    return result
}

export const getRateHistory = (history: HistoryT[]) => {
    const getResult = () => ({ good: 0, bad: 0, } as ResultT)

    const sortedHistory = history
        .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))

    const lastThree = sortedHistory.slice(-determinants.numLastRequiredQuestions)
    const resultOne = setResult(getResult(), lastThree)
    if (resultOne.bad > 0) {
        return {
            type: rating.bad,
            scale: resultOne.bad - 1
        } as RatingT
    } else {
        const lastSix = sortedHistory.slice(-determinants.numLastHighlyRatedQuestions)
        const resultTwo = setResult(getResult(), lastSix)
        return {
            type: rating.good,
            scale: resultTwo.good - 1
        } as RatingT
    }
}

const sumAndMemo = async () => {
    const answer = data.answers.shuffled[data.mark] as ShuffledT

    // dodanie wyniku odpowiedzi
    const timestamp = Date.now()
    data.answers.origin?.answer.history.push({
        timestamp,
        result: answer.correct,
    })

    // ocena historii
    const rate = getRateHistory(data.answers.origin?.answer.history as HistoryT[]);
    (data.answers.origin as LearningT).answer.rating = rate

    // zapis w pytaniach
    const { drawn, index, ...answerDb } = (data.answers.origin as LearningT).answer
    // @ts-ignore
    core.idb.answers.update(index, (old) => old = answerDb)

    const log = {
        action: (data.answers.origin as LearningT).answer.id,
        result: answer.correct,
    }

    // zapis loga
    core.idb.logs.set(timestamp, log)
}

const setGreen = (field: HTMLElement) => {
    setStyle(field, 'backgroundColor', 'var(--on_prime_color)')

    const theme = settingsThemeGet()
    if (theme === themeOrigin.dark) {
        setStyle(field, 'color', 'var(--last_color)')
    }
}

const showResult = async () => {
    data.confirm = true

    inner(elements.confirm, 'Następne')
    disable(elements.confirm)
    setTimeout(() => {
        enable(elements.confirm)
    }, 100)

    const markedAnswer = data.answers.shuffled[data.mark] as ShuffledT
    if (markedAnswer.correct) {
        setGreen(elements.answersFields[data.mark] as HTMLElement)
        addGood()
    } else {
        elements.answersFields.forEach((field, index) => {
            if (index === data.mark) {
                setStyle(field, 'backgroundColor', 'var(--off_prime_color)')
            }
            const correct = (data.answers.shuffled[index] as ShuffledT).correct
            if (correct) {
                setGreen(field)
            }
        })
        addBad()
    }

    await sumAndMemo()
}

export const clearResults = () => {
    data.confirm = false

    inner(elements.confirm, 'Zatwierdź')

    setQuestion()

    elements.answersFields.forEach((field, index) => {
        if (index % 2 === 0) {
            setStyle(field, 'backgroundColor', 'var(--penultimate_color)')
        } else {
            setStyle(field, 'backgroundColor', 'var(--third_from_end_color)')
        }
    })
}

export const confirmClick = async () => {
    if (data.confirm) {
        clearResults()
    } else {
        await showResult()
    }
}
