namespace engine {
    export namespace analize {
        // const GOOD_ANSWERS_RATIO = .995

        const countLastFewFalse = (answer: AnswersDbT) => {
            if (answer) {
                const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
                const lastFew = sortedHistory.slice(0, params.determinants.lastGood)
                const result = lastFew.filter(entry => !entry.result).length
                return result
            }
            return 0
        }

        const prepareData = (reverseLastUse: boolean) => {
            const now = helpers.getDateAtNoonInXDays(1)

            let maxLastUse = now
            let maxNextUse = now
            let maxImportance = 1
            let maxUsed = 0

            const preData: TensorDataT[] = params.data.answers.map((answer, i) => {
                // const answer = params.data.answers.find(a => a.id === question.id)
                let lastUsed = 0
                let nextUse = 0
                let rating = 0

                if (answer !== null) {
                    let theLastOne = 0
                    const history = answer.history
                    const last = answer.history.forEach(a => {
                        if (a.timestamp > theLastOne) theLastOne = a.timestamp
                    })
                    lastUsed = now - theLastOne

                    nextUse = nextUse - now
                    if (maxNextUse < nextUse) maxNextUse = nextUse

                    let allFalsies = countLastFewFalse(answer)
                    rating = allFalsies / params.determinants.lastGood
                }
                if (lastUsed < maxLastUse) maxLastUse = lastUsed

                const appearance = answer.used
                if (maxImportance < appearance) maxImportance = appearance

                if (answer && maxUsed < answer.history.length) maxUsed = answer.history.length

                return {
                    id: answer.id,
                    i, // index
                    used: answer ? answer.history.length : 0,
                    lastUsed,
                    nextUse,
                    appearance,
                    rating,
                }
            })

            const data: TensorDataT[] = preData.map(p => {
                // 1 - nieuzyte lub dawno temu, 0 - niedawno
                let lastUsed = p.lastUsed === 0 ? 1 : p.lastUsed / maxLastUse // 1 czym dalej w czasie
                if (reverseLastUse) lastUsed = 1 - lastUsed // 1 czym bliżej w czasie

                const used = maxUsed === 0 ? 1 : (1 - (p.used / maxUsed))
                return {
                    id: p.id,
                    i: p.i,
                    used, // 1 czym zadziej uzyto
                    lastUsed,
                    nextUse: p.nextUse / maxNextUse, // 1 czym bliżej w czasie
                    appearance: p.appearance / maxImportance, // 1 czym więcej użyte
                    rating: p.rating, // 1 czym więcej pomyłek
                }
            })

            return data
        }

        const checkGoodAnswers = () => {
            const countLastFewTrue = (answer: AnswersDbT) => {
                if (answer) {
                    const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
                    const lastFew = sortedHistory.slice(0, params.determinants.lastGood)
                    const result = lastFew.filter(entry => !entry.result).length
                    if (result === 0) return true
                }
                return false
            }

            let sume = 0
            params.data.answers.forEach(a => {
                if (countLastFewTrue(a)) sume++
            })
            // console.log('%c sume:', 'background: #ffcc00; color: #003300', sume)
            return sume
        }


        // const checkWeights = () => {
        //     const goodAnswersRatio = checkGoodAnswers() / params.data.questions.length

        //     const fixToFive = (num: number) => Math.round(num * 100000) / 100000

        //     if (goodAnswersRatio > GOOD_ANSWERS_RATIO) {
        //         if (fixToFive(params.data.weights.temperature) !== fixToFive(weightsEnding.temperature)) {
        //             // console.log('%c goodAnswersRatio:', 'background: #ffcc00; color: #003300', goodAnswersRatio, weights)
        //             for (const key of Object.keys(weights) as (keyof WeightsT)[]) {
        //                 weights[key] += weightsBit[key]
        //             }
        //             // drawWeightsMonitor(weights)
        //         }
        //     }
        // }



        const scoringData = (data: TensorDataT[], weights: WeightsT) => {
            const scoredData = data.map(d => {
                const score =
                    (weights.lastUsed * d.lastUsed) +
                    (weights.nextUse * d.nextUse) +
                    (weights.appearance * d.appearance) +
                    (weights.rating * d.rating) +
                    (weights.littleUsed * d.used)

                return { ...d, score } as TensorDataT
            })

            return scoredData.sort((a, b) => b.score - a.score)
        }


        export const getTensors = async (normalizedWeights: WeightsT) => {
            await params.updateAnswers()
            const data = prepareData(false)

            const result = scoringData(data, normalizedWeights)
            return result
        }

    }
}