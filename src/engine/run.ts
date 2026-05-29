namespace engine {


    export const getTensors = async () => {
        await params.updateAnswers()

        const repeatableTensors = await analize.getTensors(
            params.data.normalizedWeights.repeatable,
            params.data.repeatableAnswers)

        const selectedRepeatableTensors = select.selectByTemperature(
            repeatableTensors,
            params.repeatable.temperature,
            params.data.numOfQuestions.repeatable)

        const singleTensors = await analize.getTensors(
            params.data.normalizedWeights.single,
            params.data.singleAnswers)

        const selectedSingleTensors = select.selectByTemperature(
            singleTensors,
            params.single.temperature,
            params.data.numOfQuestions.single)

        const result = shuffle([...selectedRepeatableTensors, ...selectedSingleTensors])

        return result
    }

    const startSession = async () => {
        params.data.session = await getTensors()
        console.log('%c params.data.session:', 'background:rgb(0, 17, 255); color: #003300', params.data.session)
        params.data.index = 0
    }

    export const endSession = async () => {
        params.data.session = []
        params.data.index = -1
    }

    const getNextQuestion = async () => {
        if (params.data.index === -1) {
            await startSession()
        }

        const result = params.data.session[params.data.index]
        console.log('%c params.data.index:', 'background:rgb(255, 0, 251); color: #003300', params.data.index)
        params.data.index++

        if (params.data.index >= params.data.session.length) {
            await startSession()
        }
        return result
    }

    export const init = async () => { }

    export const getItem = async () => {
        const tensor = await getNextQuestion()

        const answer = engine.params.data.answers.find(a => a.id === tensor.id)
        const question = engine.params.data.questions.find(q => q.id === tensor.id)
        console.log('%c question:', 'background: #ffcc00; color: #003300', question)

        // const question = engine.params.data.questions[tensor.index]
        // const answer = engine.params.data.answers.find(a => a.index === tensor.index)

        const result = {
            question,
            answer,
            index: tensor.index
        } as LearningT

        return result
    }
}