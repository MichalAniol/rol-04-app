import { data, determinants, updateAnswers } from './params'
import { getTensors as analizeGetTensors } from './analize'
import { selectByTemperature } from './select'
import { data as engineData } from './params'
import { shuffle } from '../utils/shuffle'
import { AnswersT, LearningT, QuestionDbT, rating, TensorDataT, WeightsT } from '@/types'
import { core } from '@/core'
import { learningType, storageNames } from '@/storage'

const getGoodBadSplit = (answers: AnswersT[], numOfQuestions: number) => {
    const goodAnswers: AnswersT[] = []
    const badAnswers: AnswersT[] = []
    const manyToAnswer = Math.round((determinants.whenManyToAnswerPercent / 100) * numOfQuestions)

    const learningTypeMemo = core.store.get(storageNames.learningType)
    if (learningTypeMemo === learningType.upToThree) {
        answers.forEach(a => {
            const isGood = a.rating?.type === rating.good && a.rating?.scale + 1 >= determinants.numLastRequiredQuestions
            if (isGood) {
                goodAnswers.push(a)
            } else {
                badAnswers.push(a)
            }
        })
    } else {
        answers.forEach(a => {
            const lastAnswer = a.history.length > 0 ? a.history[a.history.length - 1]?.result : false
            if (lastAnswer) {
                goodAnswers.push(a)
            } else {
                badAnswers.push(a)
            }
        })
    }

    const result = {
        numGood: 0,
        numBad: 0,
        goodAnswers,
        badAnswers
    }

    if (badAnswers.length < numOfQuestions - manyToAnswer) {
        result.numGood = numOfQuestions - badAnswers.length
        result.numBad = badAnswers.length
    } else {
        const good = manyToAnswer > goodAnswers.length ? goodAnswers.length : manyToAnswer

        result.numGood = good
        result.numBad = numOfQuestions - good
    }

    return result
}

const getSpecificTensors = async (answers: AnswersT[], goodWeights: WeightsT, badWeights: WeightsT, numOfQuestions: number) => {
    const splitted = getGoodBadSplit(answers, numOfQuestions)
    // console.log('%c splitted:', 'background: #ffcc00; color: #003300', splitted)

    const good = await analizeGetTensors(goodWeights, splitted.goodAnswers)

    const goodTensors = selectByTemperature(
        good,
        goodWeights.temperature,
        splitted.numGood)

    const bad = await analizeGetTensors(badWeights, splitted.badAnswers)

    const badTensors = selectByTemperature(
        bad,
        badWeights.temperature,
        splitted.numBad)

    return [...goodTensors, ...badTensors]
}

export const getTensors = async () => {
    await updateAnswers()

    const selectedRepeatableTensors = await getSpecificTensors(data.repeatableAnswers, data.normalizedWeights.repeatableGood, data.normalizedWeights.repeatable, data.numOfQuestions.repeatable)

    const selectedSingleTensors = await getSpecificTensors(data.singleAnswers, data.normalizedWeights.singleGood, data.normalizedWeights.single, data.numOfQuestions.single)

    const result = shuffle([...selectedRepeatableTensors, ...selectedSingleTensors])
    // console.log('%c result:', 'background: #ffcc00; color: #003300', result.length)

    return result
}

const startSession = async () => {
    data.session = await getTensors()
    data.index = 0
}

export const endSession = async () => {
    data.session = []
    data.index = -1
}

const getNextQuestion = async () => {
    if (data.index === -1) {
        await startSession()
    }

    const result = data.session[data.index]
    data.index++

    if (data.index >= data.session.length) {
        await startSession()
    }
    return result
}

export const init = async () => { }

export const getItem = async () => {
    const tensor = await getNextQuestion() as TensorDataT
    const answer = engineData.answers.find(a => a.id === tensor.id)

    const questions = await core.idb.questions.getAllData()
    const questionDb = questions.find(q => q[1].id === answer?.id) as [number, QuestionDbT]
    const question = questionDb[1]

    // const question = answer ? await core.idb.questions.get((answer.index)) : emptyQuestion
    // const theSame = answer?.id === question?.id
    // console.log('%c theSame:', 'background: #ffcc00; color: #003300', theSame)

    const result = {
        question,
        answer,
        index: tensor.index
    } as LearningT

    return result
}
