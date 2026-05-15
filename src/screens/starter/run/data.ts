namespace starter {
    export namespace data {
        export const check = async () => {
            const { setStyle, inner } = dom

            const waitForIntervalClear = (intervalFn: (clear: () => void) => () => void, time: number) => {
                return new Promise<void>((resolve) => {
                    let interval: any

                    const clear = () => {
                        clearInterval(interval)
                        resolve()
                    }
                    const fn = intervalFn(clear)

                    interval = setInterval(fn, time)
                })
            }

            const versionDb = await core.store.get(storageNames.version) as string

            const response = await queries.data.getVersion(versionDb)
            const versionRes = response.version

            if (versionRes !== versionDb) {
                // pobieranie config
                const configRes = await queries.data.getConfig()
                const configDb = await core.store.get(storageNames.config) as GetConfigResponseT
                await core.store.set(storageNames.newConfig, checked.yes)
                await core.store.set(storageNames.imgAvailable, checked.no)

                if (configRes.tests !== configDb.tests) {
                    setStyle(elements.statusNow, 'display', 'initial')
                    setStyle(elements.statusAction, 'display', 'initial')
                    inner(elements.statusAction, 'wczytywanie pytań')

                    // pobieranie pytań
                    const allQuestionsRes = await queries.data.getAllQuestions()
                    const allQuestions = allQuestionsRes.map(question => {
                        if (!question.used) question.used = []
                        return question
                    })//.sort((a, b) => b.used.length - a.used.length)

                    let index = 0
                    // zapis pytań
                    const questionInterval = (clear: () => void) => async () => {
                        // console.log('%c index:', 'background: #ffcc00; color: #003300', index)
                        const question = allQuestions[index]
                        if (!question) {
                            clear()
                            return
                        }

                        inner(elements.statusAction, `wczytywanie pytań ${index + 1}/${allQuestions.length}`)

                        const item = await core.idb.questions.get(index)

                        if (!item || item.version !== question.version) {
                            await core.idb.questions.set(index, question as QuestionDbT)
                        }

                        index++
                    }
                    await waitForIntervalClear(questionInterval, 1)

                    tab.simpleMenu.showMenu()

                    inner(elements.statusAction, `wczytywanie obrazów`)
                    index = 0
                    // pobieranie i zapisywanie obrazów
                    const imageInterval = (clear: () => void) => async () => {
                        const imageDataRes = (configRes.img[index])
                        if (!imageDataRes) {
                            clear()
                            return
                        }

                        inner(elements.statusAction, `wczytywanie obrazów ${index + 1}/${configRes.img.length}`)

                        const imageDataDb = await core.idb.images.get(imageDataRes.name)

                        if (!imageDataDb || imageDataDb.version !== imageDataRes.name) {
                            const image = await queries.data.getImage(imageDataRes.name)

                            await core.idb.images.set(imageDataRes.name, {
                                version: imageDataRes.name,
                                data: image,
                            })
                        }
                        index++
                    }
                    await waitForIntervalClear(imageInterval, 100)
                    await core.store.set(storageNames.imgAvailable, checked.yes)

                    setStyle(elements.statusNow, 'display', 'none')
                    setStyle(elements.statusAction, 'display', 'none')

                    // zapamiętanie configu
                    await core.store.set(storageNames.config, configRes)
                    await core.store.set(storageNames.newConfig, checked.no)

                }

                // zapamiętanie versji
                await core.store.set(storageNames.version, versionRes)
            }


            const questions = await core.idb.questions.getAllData()
            let maxUsed = 0
            questions.forEach(async (question, index) => {
                const key = question[0]
                const q = question[1]
                if (maxUsed < q.used.length + 1) maxUsed = q.used.length + 1

                const answer = await core.idb.answers.get(key)
                if (!answer) {
                    await core.idb.answers.set(index, {
                        id: q.id,
                        history: [],
                        expectedUse: 0,
                        used: q.used.length + 1
                    })
                }
            })

            engine.params.data.quantities = Array(maxUsed).fill(0)
            questions.forEach(q => engine.params.data.quantities[q[1].used.length]++)
            console.log('%c engine.params.data.quantities:', 'background: #ffcc00; color: #003300', engine.params.data.quantities)



            // {
            //     const result: any = []
            //     const questions = await core.idb.questions.getAllData()
            //     questions.forEach((question) => {
            //         const condition = questions.some(q => q[1].id === question[1].id && q[0] !== question[0])
            //         if (condition) {
            //             const find = questions.find(q => q[1].id === question[1].id && q[0] !== question[0])
            //             result.push([question, find])
            //             // console.log('%c question[1].i:', 'background: #ffcc00; color: #003300', question[1])
            //         }
            //     })
            //     console.log('%c result:', 'background: #ffcc00; color: #003300', result)
            // }

            // setTimeout(async () => {
            //     const answers = await core.idb.answers.getAllData()
            //     console.log('%c answers:', 'background: #ffcc00; color: #003300', answers)
            // }, 100)


            tab.simpleMenu.showMenu()
        }
    }
}