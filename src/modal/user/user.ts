namespace modal {
    const { byId, inner, setStyle, add, remove } = dom

    type ElementsT = {
        modal: HTMLElement | null
        btnNewUser: HTMLButtonElement | null
        idInfo: HTMLElement | null
        idInput: HTMLInputElement | null
        // qrCodeBtn: HTMLElement | null
        // qrCodeInput: HTMLInputElement | null
        btnOldUser: HTMLButtonElement | null
    }

    const elements: ElementsT = {
        modal: null,
        btnNewUser: null,
        idInfo: null,
        idInput: null,
        // qrCodeBtn: null,
        // qrCodeInput: null,
        btnOldUser: null,
    }


    // const fileAdded = () => {
    //     if (elements.qrCodeInput.files.length === 0) {
    //         inner(elements.qrCodeBtn, 'Brak pliku')
    //         elements.btnOldUser.disabled = true
    //     } else {
    //         inner(elements.qrCodeBtn, elements.qrCodeInput.files[0].name)
    //         elements.btnOldUser.disabled = false
    //     }
    // }

    const hideUserModal = () => {
        hide()
        setStyle(elements.modal, 'display', 'none')
        // remove(elements.qrCodeInput, 'change', fileAdded)
    }

    export const user = {
        init: () => {
            elements.btnNewUser = byId('modal-user-btn-new-user') as HTMLButtonElement
            elements.modal = byId('modal-user') as HTMLElement
            elements.idInfo = byId('modal-user-id-info') as HTMLElement
            elements.idInput = byId('modal-user-id-input') as HTMLInputElement
            // elements.qrCodeBtn = byId('modal-user-qr-code-btn') as HTMLElement
            // elements.qrCodeInput = byId('modal-user-qr-code-file') as HTMLInputElement
            elements.btnOldUser = byId('modal-user-btn-old-user') as HTMLButtonElement

            utils.areNotNull(elements, ['modal', 'user'])
        },

        show: (
            setNewUser: () => void,
            getValidateUserId: (info: HTMLElement, btn: HTMLButtonElement) => (event: Event) => void,
            getCheckUserId: (info: HTMLElement, btn: HTMLButtonElement, input: HTMLInputElement, hide: () => void) => EventListenerOrEventListenerObject
        ) => {
            show()

            const { modal, btnNewUser, idInfo, idInput, btnOldUser } = elements

            setStyle(modal, 'display', 'flex')
            btnOldUser.disabled = true
            // add(elements.qrCodeInput, 'change', fileAdded)

            add(btnNewUser, 'click', async () => {
                await setNewUser()
                hideUserModal()
            })

            const validateUserId = getValidateUserId(idInfo, btnOldUser)
            add(idInput, 'input', validateUserId)

            const checkUserId = getCheckUserId(idInfo, btnOldUser, idInput, hideUserModal)
            add(btnOldUser, 'click', checkUserId)
        },
        hide: hideUserModal
    }

    // setTimeout(user.show, 100)
}