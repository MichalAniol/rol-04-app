namespace learning {
    type DataT = {
        mark: number,
        started: boolean,
        confirm: boolean,
        tabH: number,
        answers: {
            origin: LearningT | null,
            shuffled: {
                content: string,
                correct: boolean,
                number: number,
            }[]
        }
    }

    export const data: DataT = {
        mark: 0,
        started: false,
        confirm: false,
        tabH: 0,
        answers: {
            origin: null,
            shuffled: [],
        }
    }

    export namespace preparation {
        const { setStyle, add, remove, display, getPx, inner, disable, enable } = dom

        export const setSheetHight = () => {
            setStyle(elements.separator, 'height', ``)
            setStyle(elements.sheet, 'height', ``)
            setStyle(elements.sheet, 'opacity', `0`)
            // setStyle(elements.measure, 'height', ``)
            setTimeout(() => {
                const menuH = core.isMobile ? (121 / 701) * window.visualViewport.width : 0
                const sheetH = elements.measure.getBoundingClientRect().height - menuH

                const condition = sheetH < data.tabH
                setStyle(elements.bottom, 'height', getPx(menuH + (condition ? 0 : 40)))

                // const scroll = window.visualViewport.height * .2
                const separatorH = condition ? getPx(data.tabH - sheetH - 80) : ''
                // elements.sheet.scrollTop = scroll

                setStyle(elements.separator, 'height', separatorH)
                setStyle(elements.sheet, 'opacity', `1`)
            }, 300)
        }

        export const setQuestion = async () => {
            const item = await engine.getItem()
            console.log('%c item:', 'background:rgb(132, 255, 0); color: #003300', item)
            data.answers.origin = item
            evaluation.mark(-1)()
            setStyle(elements.sheet, 'opacity', `0`)

            // pytanie
            inner(elements.info, `pytanie: ${item.question.id}, wystąpiło: ${item.question.used.length + 1}x`)

            // obrazek
            if (item.question.img) {
                display(elements.img, 'block')
                const imgData = await core.idb.images.get(item.question.img)
                elements.drawImage.draw(imgData.data)
            } else {
                display(elements.img, 'none')
            }

            // opowiedzi
            inner(elements.question, item.question.question)
            const answers = [{
                content: item.question.answer,
                correct: true,
                number: -1
            }]
            item.question.falseAnswers.forEach((falseAnswer, index) => {
                answers.push({
                    content: falseAnswer,
                    correct: false,
                    number: index
                })
            })
            data.answers.shuffled = shuffle(answers)
            elements.answers.forEach((a, i) => {
                inner(a, data.answers.shuffled[i].content)
            })
            elements.answersFields.forEach((a, i) => {
                setStyle(a, 'color', 'var(--prime_color)')
            })

            setSheetHight()
        }

        export const start = async () => {
            data.started = true
            setStyle(elements.sheet, 'opacity', `0`)
            resize(window.visualViewport.width, window.visualViewport.height)

            inner(elements.startEndBtn, 'Zakończ')
            setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_4_color)')
            remove(elements.startEndBtn, 'click', start)
            add(elements.startEndBtn, 'click', end)

            await engine.init()
            setTimeout(() => {
                display(elements.sheet, 'block')
                setQuestion()
            }, 500)
        }

        export const end = () => {
            data.started = false
            display(elements.sheet, 'none')
            resize(window.visualViewport.width, window.visualViewport.height)

            inner(elements.startEndBtn, 'Rozpocznij')
            setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_color)')
            remove(elements.startEndBtn, 'click', end)
            add(elements.startEndBtn, 'click', start)
        }
    }
}