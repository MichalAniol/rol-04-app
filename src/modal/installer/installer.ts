import { areNotNull } from '@/utils/isNotNull'
import { byId, setStyle, add, remove } from '../../dom'
import { show, hide } from '../modal'

type ElementsT = {
    modal: HTMLElement
    installBtn: HTMLButtonElement
    noInstallBtn: HTMLButtonElement
}

const elements = {} as ElementsT

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string;
    }>;
    prompt(): Promise<void>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

const beforeInstallPrompt = (e: Event) => {
    e.preventDefault(); // blokuje automatyczny prompt przeglądarki
    deferredPrompt = e as BeforeInstallPromptEvent

    // pokaż swój przycisk instalacji
    const installBtn = document.getElementById('installBtn')
    if (installBtn) {
        installBtn.style.display = 'block'
    }
}

const instalClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
        console.log('Użytkownik zainstalował aplikację')
    } else {
        console.log('Użytkownik odrzucił instalację')
    }

    deferredPrompt = null
}

export const isAppInstalled = () => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
        || (window.navigator as any).standalone === true; // iOS Safari
    return isInstalled
}

export const init = () => {
    elements.modal = byId('modal-installer') as HTMLElement
    elements.installBtn = byId('modal-installer-btn') as HTMLButtonElement
    elements.noInstallBtn = byId('modal-installer-btn-no') as HTMLButtonElement

    areNotNull(elements, ['modal', 'user'])

    setStyle(elements.modal, 'display', 'none')
}

type DataT = {
    hideFn: () => void
}

const data = {} as DataT

export const showInstallerModal = (hideFn: () => void) => {
    show()
    setStyle(elements.modal, 'display', 'flex')

    add(window, 'beforeinstallprompt', beforeInstallPrompt)
    add(elements.installBtn, 'click', instalClick)
    add(elements.noInstallBtn, 'click', hideInstallerModal)

    data.hideFn = hideFn
}

export const hideInstallerModal = () => {
    hide()
    setStyle(elements.modal, 'display', 'none')

    remove(window, 'beforeinstallprompt', beforeInstallPrompt)
    remove(elements.installBtn, 'click', instalClick)
    remove(elements.noInstallBtn, 'click', hideInstallerModal)

    data.hideFn()
}