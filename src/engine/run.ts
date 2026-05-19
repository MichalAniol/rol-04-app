namespace engine {
    const shuffleArray = <T>(arr: T[]): T[] => {
        const shuffleOnce = (a: T[]) => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                const temp = a[i]
                a[i] = a[j]
                a[j] = temp
            }
        }

        for (let k = 0; k < 3; k++) {
            shuffleOnce(arr)
        }

        return arr
    }

    export const getTensors = async () => {
        const answersTensors = await analize.getTensors(params.data.normalizedWeights.repeatable)

        const repeatableTensors = select.selectByTemperature(answersTensors, params.repeatable.temperature, params.data.numOfQuestions.repeatable)

        const newAnswersTensors = answersTensors
            .filter(answer => !repeatableTensors.some(a => a.index === answer.index))

        const singleTensors = select.selectByTemperature(newAnswersTensors, params.single.temperature, params.data.numOfQuestions.single)

        return shuffleArray([...repeatableTensors, ...singleTensors])
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
        const question = engine.params.data.questions[tensor.index]
        const answer = engine.params.data.answers.find(a => a.index === tensor.index)

        const result = {
            question,
            answer,
            index: tensor.index
        }

        return result
    }
}