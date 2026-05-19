namespace engine {


    export const getTensors = async () => {
        const answersTensors = await analize.getTensors(params.data.normalizedWeights.repeatable)

        const repeatableTensors = select.selectByTemperature(answersTensors, params.repeatable.temperature, params.data.numOfQuestions.repeatable)

        const newAnswersTensors = answersTensors
            .filter(answer => !repeatableTensors.some(a => a.index === answer.index))

        const singleTensors = select.selectByTemperature(newAnswersTensors, params.single.temperature, params.data.numOfQuestions.single)

        const result = shuffle([...repeatableTensors, ...singleTensors])
        console.log('%c result:', 'background:rgb(255, 0, 179); color: #003300', result)

        return result
    }

    const createTensorGenerator = async (): Promise<AsyncGenerator<TensorDataT, void, unknown>> => {
        params.data.session = await getTensors()
        params.data.index = 0

        return (async function* (): AsyncGenerator<TensorDataT, void, unknown> {
            while (true) {
                if (params.data.index >= params.data.session.length) {
                    params.data.session = await getTensors()
                    params.data.index = 0
                }

                const result: TensorDataT =
                    params.data.session[params.data.index++]

                yield result
            }
        })()
    }

    type GeneratorT = {
        tensor: AsyncGenerator<TensorDataT, void, unknown> | null
    }

    const generator: GeneratorT = {
        tensor: null
    }

    export const init = async () => {
        generator.tensor = await createTensorGenerator()
    }

    export const getItem = async () => {
        const tensorItem = await generator.tensor.next()
        const tensor = tensorItem.value as TensorDataT

        const answer = engine.params.data.answers[tensor.index]
        const question = engine.params.data.questions[answer.index]

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