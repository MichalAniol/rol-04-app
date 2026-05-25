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
        const { setStyle, display, getPx, inner, } = dom

        export const setSheetHight = () => {
            setStyle(elements.separator, 'height', ``)
            setStyle(elements.sheet, 'height', ``)
            setStyle(elements.sheet, 'opacity', `0`)
            // setStyle(elements.measure, 'height', ``)
            setTimeout(() => {
                const menuH = core.isMobile ? (121 / 701) * window.visualViewport.width : 0
                const sheetH = elements.measure.getBoundingClientRect().height - menuH

                const condition = sheetH < data.tabH - menuH
                setStyle(elements.bottom, 'height', getPx(menuH + (condition ? 0 : 40)))

                // const scroll = window.visualViewport.height * .2
                const separatorH = condition ? getPx(data.tabH - sheetH - 80) : ''
                // elements.sheet.scrollTop = scroll

                setStyle(elements.separator, 'height', separatorH)
                setStyle(elements.sheet, 'opacity', `1`)
            }, 300)
        }

        type MonthKeys = 'paz' | 'cze' | 'sty' | 'wrz' | 'lut'
        const getMonth = (key: MonthKeys) => {
            const idToMonth = {
                paz: 'pazdziernik',
                cze: 'czerwiec',
                sty: 'styczeń',
                lut: 'styczeń',
                wrz: 'wrzesień',
            }

            return idToMonth[key]
        }

        const idToDate = (id: string) => {
            const splittedId = id.split('-')
            const year = splittedId[0]
            const month = getMonth(splittedId[1] as MonthKeys)

            return `${month} ${year}`
        }

        const idsToDate = (ids: string[]) => {
            let result = ''
            ids.forEach((id, i, arr) => result += idToDate(id) + (i === arr.length - 1 ? '' : ', '))
            return result
        }

        export const setQuestion = async () => {
            const item = await engine.getItem()

            //FIXME - 
            if (!item.question.img) {
                setQuestion()
                return
            }
            //FIXME - 

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
            const usedList = [item.question.id, ...item.question.used]
            inner(elements.info, `wystąpiło <b>${usedList.length}x</b> w: ${idsToDate(usedList)}.`)

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