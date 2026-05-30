import { generateTriangularSequence } from './helpers'
import { WeightsT, WeightsKeyT, AnswersT, TensorDataT } from '../types'
import { core } from '../core'
import { storageNames } from '@/storage'

export const determinants = {
    questionInSession: 30,
    numLastRequiredQuestions: 3, // ile razy pod rząd trzeba odpowiedzieć, żeby było uznane, że umiesz (100%)
    numLastHighlyRatedQuestions: 6, // --//-- , że umiesz super dobrze (200%)
    // intelligence: 1 / 3, // prawdopodobieństwo na ile % odpowiada dobrze
    repetition: generateTriangularSequence(10),
    whenManyToAnswerPercent: 15,
} as const

export const repeatable: WeightsT = {
    lastUsed: 0.1, // ostatnie użycie pytania
    nextUse: 0.3, // następne planowane użycie pytania
    appearance: 0.1, // w ilu testach pojawiło się pytanie
    rating: 1.2, // poziom nauki pytań
    littleUsed: 0, // najmniej powtarzalne pytania
    temperature: 0.1, // wielkość zbioru do losowania
} as const
export const repeatableGood: WeightsT = {
    lastUsed: 0.1, // ostatnie użycie pytania
    nextUse: 0.3, // następne planowane użycie pytania
    appearance: 0.1, // w ilu testach pojawiło się pytanie
    rating: 0.2, // poziom nauki pytań
    littleUsed: 0, // najmniej powtarzalne pytania
    temperature: 1, // wielkość zbioru do losowania
} as const

export const single: WeightsT = {
    lastUsed: 0.1, // ostatnie użycie pytania
    nextUse: 0.2, // następne planowane użycie pytania
    appearance: 0.1, // w ilu testach pojawiło się pytanie
    rating: 5, // poziom nauki pytań
    littleUsed: 0, // najmniej powtarzalne pytania
    temperature: 0.05,
} as const
export const singleGood: WeightsT = {
    lastUsed: 0.1, // ostatnie użycie pytania
    nextUse: 0.2, // następne planowane użycie pytania
    appearance: 0.1, // w ilu testach pojawiło się pytanie
    rating: .3, // poziom nauki pytań
    littleUsed: 0, // najmniej powtarzalne pytania
    temperature: 1,
} as const

export type NormalizedWeightsT = {
    repeatable: WeightsT
    repeatableGood: WeightsT
    single: WeightsT
    singleGood: WeightsT
}

type DataT = {
    weights: WeightsT | null
    answers: AnswersT[]
    repeatableAnswers: AnswersT[]
    singleAnswers: AnswersT[]
    quantities: number[]
    sume: number,
    normalizedWeights: NormalizedWeightsT
    numOfQuestions: {
        repeatable: number
        single: number
    }
    session: TensorDataT[]
    index: number
}

export const data: DataT = {
    weights: null,
    answers: [],
    repeatableAnswers: [],
    singleAnswers: [],
    quantities: [],
    sume: 0,
    normalizedWeights: {} as NormalizedWeightsT,
    numOfQuestions: {
        repeatable: 0,
        single: 0,
    },
    session: [],
    index: -1,
}

// Wagi dla cech (suma nie musi być 1, ale lepiej by była)
const getNormalizedWeights = (weights: WeightsT) => {
    let sume = 0
    Object.keys(weights).forEach((key) => sume += weights[key as WeightsKeyT])
    sume -= weights.temperature

    const normalizedWeights = { ...weights }
    Object.keys(weights).forEach((key) => normalizedWeights[key as WeightsKeyT] = weights[key as WeightsKeyT] / sume)

    normalizedWeights.temperature = weights.temperature
    return normalizedWeights
}

export const init = async () => {
    data.normalizedWeights.repeatable = getNormalizedWeights(repeatable)
    data.normalizedWeights.repeatableGood = getNormalizedWeights(repeatableGood)
    data.normalizedWeights.single = getNormalizedWeights(single)
    data.normalizedWeights.singleGood = getNormalizedWeights(singleGood)

    // const now = helpers.getDateAtNoonInXDays(1)
    // const answers = await core.idb.answers.getAllData()

    // wyrównie czasu na opowiedz jeśli minęła
    // await answers.forEach(async (answer, i) => {
    //     if (answer[1].expectedUse < now) {
    //         answer[1].expectedUse = helpers.getDateAtNoonInXDays(0, now)
    //         await core.idb.answers.set(...answer)
    //     }
    // })
    const questionRatio = Number(core.store.get(storageNames.questionsRatio))
    const questionNum = determinants.questionInSession

    data.numOfQuestions.repeatable = questionRatio
    data.numOfQuestions.single = questionNum - questionRatio
}

export const updateAnswers = async () => {
    const answersDb = await core.idb.answers.getAllData()

    // mapowanie z indeksem
    const newAnswers = answersDb.map((answer) => {
        const index = answer[0]
        const item = answer[1] as AnswersT

        item.drawn = false
        item.index = index

        return item
    })
    // sortowanie
    const answers = newAnswers
        .sort((a, b) => b.used - a.used)

    // zapis do danych silnika
    data.answers = []
    data.repeatableAnswers = []
    data.singleAnswers = []

    answers.forEach((answer, i) => {
        data.answers[i] = answer

        if (answer.used === 1) {
            data.singleAnswers.push(answer)
        } else {
            data.repeatableAnswers.push(answer)
        }
    })
}
