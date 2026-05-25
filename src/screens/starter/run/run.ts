namespace starter {
    export const run = async () => {
        utils.waitFor(() => engine.params.data.sume !== 0, async () => {
            const started = await core.store.get(storageNames.sessionStarted)
            if (started === checked.yes) {
                await queries.statistics.memoAnswers()
                await queries.statistics.memoLogs()
                await core.store.set(storageNames.sessionStarted, checked.no)

                learning.resize(window.visualViewport.width, window.visualViewport.height)
            }
        })()

        await user.init(data.check)
    }
}