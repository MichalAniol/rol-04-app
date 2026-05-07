namespace starter {
    export namespace data {
        export const check = async () => {
            const { setStyle, inner } = dom


            const versionDb = await core.store.get(storageNames.version) as string

            const response = await queries.data.getVersion(versionDb)
            const versionRes = response.version

            if (versionRes !== versionDb) {
                const configRes = await queries.data.getConfig()
                const configDb = await core.store.get(storageNames.config) as GetConfigResponseT
                console.log('%c configDb:', 'background: #ffcc00; color: #003300', configDb)

                if (configRes.tests !== configDb.tests) {
                    setStyle(elements.statusNow, 'display', 'initial')
                    setStyle(elements.statusAction, 'display', 'initial')
                    inner(elements.statusAction, 'wczytywanie pytań')

                    const allQuestionsRes = await queries.data.getAllQuestions()
                    console.log('%c allQuestionsRes:', 'background: #ffcc00; color: #003300', allQuestionsRes)

                    let index = 0
                    const interval = setInterval(async () => {
                        const question = allQuestionsRes[index]
                        if (!question) {
                            clearInterval(interval)

                            // dodać img

                            // await core.store.set(storageNames.config, configRes)
                            return
                        }

                        inner(elements.statusAction, `wczytywanie pytań ${index + 1}/${allQuestionsRes.length}`)

                        const { id, ...newItem } = question

                        const item = await core.idb.questions.get(id)

                        if (!item || item.version !== newItem.version) {
                            await core.idb.questions.set(id, newItem)
                        }

                        index++
                    }, 1)


                }

                // await core.store.set(storageNames.version, versionRes) 
            }
        }
    }
}