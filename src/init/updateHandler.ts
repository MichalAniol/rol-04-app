type UpdateStage =
    | 'installing'
    | 'cached'
    | 'activating'
    | 'activated'

type SWUpdateMessage = {
    type: 'UPDATE_STAGE'
    stage: UpdateStage
    version?: string
}

const createPwaUpdateHandler = () => {
    let isUpdating = false

    const loader = document.getElementById('loader') as HTMLElement | null

    const showLoader = (text?: string) => {
        if (loader) {
            loader.style.display = 'block'
            if (text) loader.textContent = text
        }
    }

    const hideLoader = () => {
        if (loader) {
            loader.style.display = 'none'
        }
    }

    const onStart = () => {
        isUpdating = true
        showLoader('Aktualizacja aplikacji...')
    }

    const onProgress = (stage: UpdateStage) => {
        switch (stage) {
            case 'installing':
                showLoader('Pobieranie aktualizacji...')
                break

            case 'cached':
                showLoader('Zakończono pobieranie...')
                break

            case 'activating':
                showLoader('Aktywowanie aktualizacji...')
                break
        }
    }

    const onEnd = (version?: string) => {
        showLoader('Przeładowywanie...')
        isUpdating = false

        setTimeout(() => {
            location.reload()
        }, 300)
    }

    const handleMessage = (event: MessageEvent<SWUpdateMessage>) => {
        const data = event.data

        if (!data || data.type !== 'UPDATE_STAGE') return

        if (!isUpdating) {
            isUpdating = true
            onStart()
        }

        if (data.stage === 'activated') {
            onEnd(data.version)
            return
        }

        onProgress(data.stage)
    }

    return {
        init: () => {
            if (loader) loader.style.display = 'none'

            navigator.serviceWorker.addEventListener('message', handleMessage)
        },
        hide: hideLoader,
        show: showLoader
    }
}

const pwaUpdateHandler = createPwaUpdateHandler()
pwaUpdateHandler.init()