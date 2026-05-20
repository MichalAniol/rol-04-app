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

        const showResult = () => {
            data.confirm = true

            inner(elements.confirm, 'Następne')
            disable(elements.confirm)
            setTimeout(() => {
                enable(elements.confirm)
            }, 1000)


            const markedAnswer = data.answers.shuffled[data.mark]
            if (markedAnswer.correct) {
                setStyle(elements.answersFields[data.mark], 'backgroundColor', 'var(--on_prime_color)')
            } else {
                elements.answersFields.forEach((field, index) => {
                    if (index === data.mark) {
                        setStyle(field, 'backgroundColor', 'var(--off_prime_color)')
                    }
                    const correct = data.answers.shuffled[index].correct
                    if (correct) {
                        setStyle(field, 'backgroundColor', 'var(--on_prime_color)')
                    }
                })
            }
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

        export const confirmClick = () => {
            if (data.confirm) {
                clearResults()
            } else {
                showResult()
            }
        }
    }
}