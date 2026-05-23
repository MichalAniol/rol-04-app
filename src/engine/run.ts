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