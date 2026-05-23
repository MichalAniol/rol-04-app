namespace learning {
    export namespace evaluation {
        const { byId, byQueryAll, setStyle, add, remove, display, getPx, inner, disable, enable } = dom

        export const mark = (num: number) => () => {
            if (num === -1) {
                disable(elements.confirm)
            } else {
                enable(elements.confirm)
            }

            data.mark = num
            elements.checkbox.forEach((a, i) => a.checked = (i === num))
            elements.answersFields.forEach((a, i) => i === num ? setStyle(a, 'border', '2px solid var(--mine_color)') : setStyle(a, 'border', '2px solid transparent'))
        }

        type ResultT = {
            good: number
            bad: number
        }

        const setResult = (result: ResultT, history: HistoryT[]) => {
            history.forEach(h => {
                if (h.result) {
                    result.good++
                } else {
                    result.bad++
                }
            })
            return result
        }

        const rateHistory = () => {
            const getResult = () => ({ good: 0, bad: 0, } as ResultT)

            const sortedHistory = learning.data.answers.origin.answer.history
                .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))

            const lastThree = sortedHistory.slice(-engine.params.determinants.numLastRequiredQuestions)
            const resultOne = setResult(getResult(), lastThree)
            if (resultOne.bad > 0) {
                learning.data.answers.origin.answer.rating = {
                    type: rating.bad,
                    scale: resultOne.bad - 1
                }
            } else {
                const lastSix = sortedHistory.slice(-engine.params.determinants.numLastHighlyRatedQuestions)
                const resultTwo = setResult(getResult(), lastSix)
                learning.data.answers.origin.answer.rating = {
                    type: rating.good,
                    scale: resultTwo.good - 1
                }
            }
        }

        const sumAndMemo = async () => {
            const answer = data.answers.shuffled[data.mark]

            // dodanie wyniku odpowiedzi
            const timestamp = Date.now()
            learning.data.answers.origin.answer.history.push({
                timestamp,
                result: answer.correct,
            })

            // ocena historii
            rateHistory()

            // zapis w pytaniach
            const { drawn, index, ...answerDb } = learning.data.answers.origin.answer
            core.idb.answers.update(index, (old) => old = answerDb)

            const log = {
                action: learning.data.answers.origin.answer.id,
                result: answer.correct,
                status: answer.number,
            }

            // zapis loga
            core.idb.logs.set(timestamp, log)
        }

        const setGreen = (field:  HTMLElement) => {
            setStyle(field, 'backgroundColor', 'var(--on_prime_color)')

            const theme = settings.theme.get()
            console.log('%c theme:', 'background: #ffcc00; color: #003300', theme)
            if (theme === settings.theme.theme.dark) {
                setStyle(field, 'color', 'var(--last_color)')
            }
        }

        const showResult = async () => {
            data.confirm = true

            inner(elements.confirm, 'Następne')
            disable(elements.confirm)
            setTimeout(() => {
                enable(elements.confirm)
            }, 1000)

            const markedAnswer = data.answers.shuffled[data.mark]
            if (markedAnswer.correct) {
                setGreen(elements.answersFields[data.mark])
            } else {
                elements.answersFields.forEach((field, index) => {
                    if (index === data.mark) {
                        setStyle(field, 'backgroundColor', 'var(--off_prime_color)')
                    }
                    const correct = data.answers.shuffled[index].correct
                    if (correct) {
                        setGreen(field)
                    }
                })
            }

            await sumAndMemo()
        }

        const clearResults = () => {
            data.confirm = false

            inner(elements.confirm, 'Zatwierdź')

            preparation.setQuestion()

            elements.answersFields.forEach((field, index) => {
                if (index % 2 === 0) {
                    setStyle(field, 'backgroundColor', 'var(--penultimate_color)')
                } else {
                    setStyle(field, 'backgroundColor', 'var(--third_from_end_color)')
                }
            })
        }

        export const confirmClick = async () => {
            if (data.confirm) {
                clearResults()
            } else {
                await showResult()
            }
        }
    }
}