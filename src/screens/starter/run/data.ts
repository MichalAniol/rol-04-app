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
                setStyle(elements.statusAction, 'display', 'initial')
                inner(elements.statusAction, 'wczytywanie pytań')

                // pobieranie config
                const configRes = await queries.data.getConfig()
                // console.log('%c configRes:', 'background: #ffcc00; color: #003300', configRes)
                const configTestsDb = await core.store.get(storageNames.configTests)

                if (configRes.tests !== configTestsDb) {
                    setStyle(elements.statusNow, 'display', 'initial')

                    // pobieranie pytań
                    const allQuestionsRes = await queries.data.getAllQuestions()
                    const allQuestions = allQuestionsRes.map(question => {
                        if (!question.used) question.used = []
                        return question
                    })

                    let index = 0
                    // zapis pytań
                    const questionInterval = (clear: () => void) => async () => {
                        const question = allQuestions[index]
                        if (!question) {
                            await core.store.set(storageNames.configTests, configRes.tests)
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

                    if (core.isMobile) tab.simpleMenu.showMenu()

                }

                const imgAvailable = await core.store.get(storageNames.imgAvailable)
                if (imgAvailable === checked.no) {
                    inner(elements.statusAction, `wczytywanie obrazów`)

                    const imgSToAdd: ConfigResponseImgT[] = []
                    await configRes.img.forEach(async (img) => {
                        const imgDb = await core.idb.images.get(img.name)
                        if (!imgDb || imgDb.version !== img.version) imgSToAdd.push(img)
                    })

                    let index = 0
                    // pobieranie i zapisywanie obrazów
                    const imageInterval = (clear: () => void) => async () => {
                        const imageDataRes = imgSToAdd[index]
                        console.log('%c imageDataRes:', 'background: #ffcc00; color: #003300', imageDataRes)
                        if (!imageDataRes) {
                            await core.store.set(storageNames.imgAvailable, checked.yes)

                            setStyle(elements.statusNow, 'display', 'none')
                            setStyle(elements.statusAction, 'display', 'none')

                            // zapamiętanie versji
                            await core.store.set(storageNames.version, versionRes)

                            clear()
                            return
                        }

                        inner(elements.statusAction, `wczytywanie obrazów ${index + 1}/${imgSToAdd.length}`)
                        index++

                        const image = await queries.data.getImage(imageDataRes.name)
                        if (image) {
                            await core.idb.images.set(imageDataRes.name, {
                                version: imageDataRes.version,
                                data: await utils.blob.toString(image),
                            })
                        }
                    }
                    waitForIntervalClear(imageInterval, 1000)
                }
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

            // sumy rodzajów pytań
            engine.params.data.quantities = Array(maxUsed).fill(0)
            engine.params.data.sume = 0
            questions.forEach(q => {
                engine.params.data.quantities[q[1].used.length]++
                engine.params.data.sume++
            })

            // ilość pytań, aby ułożyć je w kwadrat
            statistics.data.monitor.size = (Math.ceil(Math.sqrt(engine.params.data.sume)))


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


            if (core.isMobile) tab.simpleMenu.showMenu()
        }
    }
}