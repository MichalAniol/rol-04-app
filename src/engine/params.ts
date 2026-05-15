type WeightsT = {
    lastUsed: number,
    nextUse: number,
    appearance: number,
    rating: number,
    littleUsed: number,
    temperature: number,
}

namespace engine {
    export namespace params {
        export const determinants = {
            questionInSession: 30,
            lastGood: 3,
            // intelligence: 1 / 3, // prawdopodobieństwo na ile % odpowiada dobrze
            repetition: helpers.generateTriangularSequence(10),
        } as const

        export const repeatable: WeightsT = {
            lastUsed: 0.1, // ostatnie użycie pytania
            nextUse: 0.3, // następne planowane użycie pytania
            appearance: 0.1, // w ilu testach pojawiło się pytanie
            rating: 1.2, // poziom nauki pytań
            littleUsed: 0, // najmniej powtarzalne pytania
            temperature: 0.1, // wielkośc zbioru do losowania
        } as const

        export const single: WeightsT = {
            lastUsed: 0.2, // ostatnie użycie pytania
            nextUse: 0.5, // następne planowane użycie pytania
            appearance: 0.1, // w ilu testach pojawiło się pytanie
            rating: 2, // poziom nauki pytań
            littleUsed: 2, // najmniej powtarzalne pytania
            temperature: 1,
        } as const

        type DataT = {
            weights: WeightsT | null,
            questions: QuestionDbT[] | null,
            answers: AnswersT[] | null,
            quantities: number[],
            normalizedWeights: {
                repeatable: WeightsT | null,
                single: WeightsT | null,
            },
            numOfQuestions: {
                repeatable: number | null,
                single: number | null,
            }
        }

        export const data: DataT = {
            weights: null,
            questions: null,
            answers: null,
            quantities: [],
            normalizedWeights: {
                repeatable: null,
                single: null,
            },
            numOfQuestions: {
                repeatable: 0,
                single: 0,
            }
        }

        // Wagi dla cech (suma nie musi być 1, ale lepiej by była)
        const getNormalizedWeights = (weights: WeightsT) => {
            let sume = 0
            Object.keys(weights).forEach((key: WeightsKeyT) => sume += weights[key])
            sume -= weights.temperature

            const normalizedWeights = { ...weights }
            Object.keys(weights).forEach((key: WeightsKeyT) => normalizedWeights[key] = weights[key] / sume)

            normalizedWeights.temperature = weights.temperature
            return normalizedWeights
        }

        const updateQuestions = async () => {
            const questions = await core.idb.questions.getAllData()
            data.questions = []

            questions.forEach(question => {
                const index = question[0]
                const item: QuestionDbT = question[1] as QuestionDbT

                data.questions[index] = item
            })
        }

        export const init = async () => {
            await updateQuestions()
            data.normalizedWeights.repeatable = getNormalizedWeights(repeatable)
            data.normalizedWeights.single = getNormalizedWeights(single)

            const now = helpers.getDateAtNoonInXDays(1)
            const answers = await core.idb.answers.getAllData()

            // wyrównie czasu na opowiedz jeśli minęła
            await answers.forEach(async (answer, i) => {
                if (answer[1].expectedUse < now) {
                    answer[1].expectedUse = helpers.getDateAtNoonInXDays(0, now)
                    await core.idb.answers.set(...answer)
                }
            })
            const questionRatio = Number(core.store.get(storageNames.questionsRatio))
            const questionNum = params.determinants.questionInSession

            data.numOfQuestions.repeatable = questionRatio
            data.numOfQuestions.single = questionNum - questionRatio 
        }

        export const updateAnswers = async () => {
            const answersDb = await core.idb.answers.getAllData()
            const answers = answersDb
                .sort((a, b) => b[1].used - a[1].used)
            data.answers = []

            answers.forEach((answer, i) => {
                const index = answer[0]
                const item = answer[1] as AnswersT

                item.drawn = false
                item.index = index


                data.answers[i] = item
            })
        }


    }
}