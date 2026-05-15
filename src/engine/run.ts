namespace engine {

    export const get20questions = async () => {
        const answersTensors = await analize.getTensors(params.data.normalizedWeights.repeatable)

        const repeatableTensors = select.selectByTemperature(answersTensors, params.repeatable.temperature, params.data.numOfQuestions.repeatable)

        const newAnswersTensors = answersTensors
            .filter(answer => !repeatableTensors.some(a => a.i === answer.i))

        const singleTensors = select.selectByTemperature(newAnswersTensors, params.single.temperature, params.data.numOfQuestions.single)

        const tensors = [...repeatableTensors, ...singleTensors]
        console.log('%c tensors:', 'background: #ffcc00; color: #003300', tensors)
    }

}