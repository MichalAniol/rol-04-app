namespace learning {
    type DataT = {
        mark: number,
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
        confirm: false,
        tabH: 0,
        answers: {
            origin: null,
            shuffled: [],
        }
    }

    export namespace preparation {
        const { setStyle, display, getPx, inner, boundRect } = dom

        export const setSheetHight = () => {
            setStyle(elements.separator, 'height', ``)
            setStyle(elements.sheet, 'height', ``)
            setStyle(elements.sheet, 'opacity', `0`)
            // setStyle(elements.measure, 'height', ``)
            setTimeout(() => {
                const menuH = core.isMobile ? (121 / 701) * window.visualViewport.width : 0
                const sheetH = boundRect(elements.measure).height - menuH

                const condition = sheetH < data.tabH - menuH - 60
                setStyle(elements.bottom, 'height', getPx(menuH + (condition ? 0 : 80)))

                // const scroll = window.visualViewport.height * .2
                const separatorH = condition ? getPx(data.tabH - sheetH - 80) : ''
                // elements.sheet.scrollTop = scroll

                setStyle(elements.separator, 'height', separatorH)
                setStyle(elements.sheet, 'opacity', `1`)
            }, 300)
        }

        export const setQuestion = async () => {
            const item = await engine.getItem()

            if (item.question.img) {
                const imgData = await core.idb.images.get(item.question.img)

                if (imgData === null) {
                    setQuestion()
                    return
                }
            }

            data.answers.origin = item
            evaluation.mark(-1)()
            setStyle(elements.sheet, 'opacity', `0`)

            // pytanie info
            setTimeout(() => {
                const usedList = [item.question.id]
                item.question.used.forEach(u => usedList.push(u))

                setTimeout(() => {
                    inner(elements.info, `nazwa: <b>${item.question.id}</b><br><br>wystąpiło <b>${usedList.length}x</b> w: ${utils.idToDate.get(usedList)}.`)
                }, 100)
            }, 100)

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
    }
}