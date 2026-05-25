namespace learning {
    export namespace startEnd {
        const { setStyle, add, remove, display, inner } = dom

        export const start = async () => {
            await core.store.set(storageNames.sessionStarted, checked.yes)
            setStyle(elements.sheet, 'opacity', `0`)
            resize(window.visualViewport.width, window.visualViewport.height)

            inner(elements.startEndBtn, 'Zakończ')
            setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_4_color)')
            remove(elements.startEndBtn, 'click', start)
            add(elements.startEndBtn, 'click', end)

            await engine.init()
            setTimeout(() => {
                display(elements.sheet, 'block')
                preparation.setQuestion()
            }, 500)
        }

        export const end = async () => {
            await core.store.set(storageNames.sessionStarted, checked.no)
            display(elements.sheet, 'none')
            resize(window.visualViewport.width, window.visualViewport.height)

            inner(elements.startEndBtn, 'Rozpocznij')
            setStyle(elements.startEndBtn, 'backgroundColor', 'var(--mine_color)')
            remove(elements.startEndBtn, 'click', end)
            add(elements.startEndBtn, 'click', start)

            queries.statistics.memoAnswers()
            queries.statistics.memoLogs()

            engine.endSession()
            learning.data.answers.origin = null
        }
    }
}