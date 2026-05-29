import { data, repeatable, single, updateAnswers } from './params'
import { getTensors as analizeGetTensors } from './analize'
import { selectByTemperature } from './select'
import { data as engineData } from '../engine/params'
import { shuffle } from '../utils/shuffle'
import { LearningT, TensorDataT, WeightsT } from '@/types'

export const getTensors = async () => {
    await updateAnswers()

    const repeatableTensors = await analizeGetTensors(
        data.normalizedWeights.repeatable as WeightsT,
        data.repeatableAnswers)

    const selectedRepeatableTensors = selectByTemperature(
        repeatableTensors,
        repeatable.temperature,
        data.numOfQuestions.repeatable)

    const singleTensors = await analizeGetTensors(
        data.normalizedWeights.single as WeightsT,
        data.singleAnswers)

    const selectedSingleTensors = selectByTemperature(
        singleTensors,
        single.temperature,
        data.numOfQuestions.single)

    const result = shuffle([...selectedRepeatableTensors, ...selectedSingleTensors])

    return result
}

const startSession = async () => {
    data.session = await getTensors()
    console.log('%c params.data.session:', 'background:rgb(0, 17, 255); color: #003300', data.session)
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
    console.log('%c params.data.index:', 'background:rgb(255, 0, 251); color: #003300', data.index)
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
    const question = engineData.questions.find(q => q.id === tensor.id)
    console.log('%c question:', 'background: #ffcc00; color: #003300', question)

    // const question = engineData.questions[tensor.index]
    // const answer = engineData.answers.find(a => a.index === tensor.index)

    const result = {
        question,
        answer,
        index: tensor.index
    } as LearningT

    return result
}
