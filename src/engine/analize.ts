import { determinants } from './params'
import { getDateAtNoonInXDays } from './helpers'
import { AnswersDbT, AnswersT, TensorDataT, WeightsT } from '@/types'

type CountLastFewFalseT = {
    falsies: number
    trues: number
}

const countLastFewFalse = (answer: AnswersDbT) => {
    if (answer) {
        const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
        const lastFew = sortedHistory.slice(0, determinants.numLastRequiredQuestions)

        return {
            falsies: lastFew.filter(entry => !entry.result).length,
            trues: lastFew.filter(entry => entry.result).length,
        } as CountLastFewFalseT
    }
    return {
        falsies: 0,
        trues: 0,
    }
}

const prepareData = (reverseLastUse: boolean, answers: AnswersT[]) => {
    const now = getDateAtNoonInXDays(1)

    let maxLastUse = now
    let maxNextUse = now
    let maxImportance = 1
    let maxUsed = 0

    const preData: TensorDataT[] = answers.map((answer, index) => {
        // const answer = answers.find(a => a.id === question.id)
        let lastUsed = 0
        let nextUse = 0
        let rating = 0

        if (answer !== null) {
            let theLastOne = 0
            lastUsed = now - theLastOne

            nextUse = nextUse - now
            if (maxNextUse < nextUse) maxNextUse = nextUse

            let lastAnswers = countLastFewFalse(answer)
            let rating = 0
            if (lastAnswers.trues >= determinants.numLastRequiredQuestions) {
                rating = -10
            } else {
                rating = lastAnswers.falsies / determinants.numLastRequiredQuestions
            }
        }

        if (lastUsed < maxLastUse) maxLastUse = lastUsed

        const appearance = answer.used
        if (maxImportance < appearance) maxImportance = appearance

        if (answer && maxUsed < answer.history.length) maxUsed = answer.history.length

        return {
            id: answer.id,
            index, // index
            used: answer ? answer.history.length : 0,
            lastUsed,
            nextUse,
            appearance,
            rating,
        }
    })

    const data: TensorDataT[] = preData.map(p => {
        // 1 - nieuzyte lub dawno temu, 0 - niedawno
        let lastUsed = p.lastUsed === 0 ? 1 : (p.lastUsed as number) / maxLastUse // 1 czym dalej w czasie
        if (reverseLastUse) lastUsed = 1 - lastUsed // 1 czym bliżej w czasie

        const used = maxUsed === 0 ? 1 : (1 - ((p.used as number) / maxUsed))
        return {
            id: p.id,
            index: p.index,
            used, // 1 czym zadziej uzyto
            lastUsed,
            nextUse: (p.nextUse as number) / maxNextUse, // 1 czym bliżej w czasie
            appearance: (p.appearance as number) / maxImportance, // 1 czym więcej użyte
            rating: p.rating, // 1 czym więcej pomyłek
        } as TensorDataT
    })

    return data
}

const scoringData = (data: TensorDataT[], weights: WeightsT) => {
    const scoredData = data.map(d => {
        const score =
            (weights.lastUsed * (d.lastUsed as number)) +
            (weights.nextUse * (d.nextUse as number)) +
            (weights.appearance * (d.appearance as number)) +
            (weights.rating * (d.rating as number)) +
            (weights.littleUsed * (d.used as number))

        return { ...d, score } as TensorDataT
    })

    return scoredData.sort((a, b) => (b.score as number) - (a.score as number))
}


export const getTensors = async (normalizedWeights: WeightsT, answers: AnswersT[]) => {
    const data = prepareData(false, answers)

    const result = scoringData(data, normalizedWeights)
    return result
}
