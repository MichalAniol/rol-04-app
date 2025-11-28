namespace modal {
    const { byId, inner, setStyle, add, remove } = dom

    type ElementsT = {
        modal: HTMLElement | null
        idInput: HTMLInputElement | null
        qrCodeBtn: HTMLElement | null
        qrCodeInput: HTMLInputElement | null
        btnOldUser: HTMLButtonElement | null
        btnNewUser: HTMLButtonElement | null
    }

    const elements: ElementsT = {
        modal: null,
        idInput: null,
        qrCodeBtn: null,
        qrCodeInput: null,
        btnOldUser: null,
        btnNewUser: null,
    }


    const fileAdded = () => {
        if (elements.qrCodeInput.files.length === 0) {
            inner(elements.qrCodeBtn, 'Brak pliku')
            elements.btnOldUser.disabled = true
        } else {
            inner(elements.qrCodeBtn, elements.qrCodeInput.files[0].name)
            elements.btnOldUser.disabled = false
        }
    }

    // const setUser = () => {
    //     queries.
    // }

    export const user = {
        init: () => {
            elements.modal = byId('modal-user')
            elements.idInput = byId('modal-user-id-input') as HTMLInputElement
            elements.qrCodeBtn = byId('modal-user-qr-code-btn')
            elements.qrCodeInput = byId('modal-user-qr-code-file') as HTMLInputElement
            elements.btnOldUser = byId('modal-user-btn-old-user') as HTMLButtonElement
            elements.btnNewUser = byId('modal-user-btn-new-user') as HTMLButtonElement
        },
        show: () => {
            show()
            setStyle(elements.modal, 'display', 'flex')
            elements.btnOldUser.disabled = true
            add(elements.qrCodeInput, 'change', fileAdded)
        },
        hide: () => {
            hide()
            setStyle(elements.modal, 'display', 'none')
            remove(elements.qrCodeInput, 'change', fileAdded)
        }
    }

    // setTimeout(user.show, 100)
}