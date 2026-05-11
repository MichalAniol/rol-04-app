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
                const configRes = await queries.data.getConfig()
                const configDb = await core.store.get(storageNames.config) as GetConfigResponseT

                if (configRes.tests !== configDb.tests) {
                    setStyle(elements.statusNow, 'display', 'initial')
                    setStyle(elements.statusAction, 'display', 'initial')
                    inner(elements.statusAction, 'wczytywanie pytań')

                    const allQuestionsRes = await queries.data.getAllQuestions()

                    let index = 0
                    const questionInterval = (clear: () => void) => async () => {
                        console.log('%c index:', 'background: #ffcc00; color: #003300', index)
                        const question = allQuestionsRes[index]
                        if (!question) {
                            clear()
                            return
                        }

                        inner(elements.statusAction, `wczytywanie pytań ${index + 1}/${allQuestionsRes.length}`)

                        const { id, ...newItem } = question

                        const item = await core.idb.questions.get(id)

                        if (!item || item.version !== newItem.version) {
                            await core.idb.questions.set(id, newItem)
                        }

                        index++
                    }
                    await waitForIntervalClear(questionInterval, 1)

                    inner(elements.statusAction, `wczytywanie obrazów`)
                    index = 0
                    const imageInterval = (clear: () => void) => async () => {
                        const imageDataRes = (configRes.img[index])
                        if (!imageDataRes) {
                            clear()
                            return
                        }
                        console.log('%c imageDataRes.name:', 'background: #ffcc00; color: #003300', imageDataRes.name)

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
                    await waitForIntervalClear(imageInterval, 500)

                    setStyle(elements.statusNow, 'display', 'none')
                    setStyle(elements.statusAction, 'display', 'none')

                    await core.store.set(storageNames.config, configRes)

                    // console.log('%c imageInterval:', 'background:rgb(255, 0, 247); color: #003300', imageInterval)
                }

                await core.store.set(storageNames.version, versionRes) 
            }
        }
    }
}