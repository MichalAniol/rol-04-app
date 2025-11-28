namespace queries {
    export const url = (function () {
        const main = `api/`
        const rol04 = `rol04/api/`

        return {
            test: {
                csrf: `${main}csrf`,
                ddos: `${main}ddos`,
                ddosId: `${main}ddos-id`,
                noMahakala: `${main}no-mahakala`,
                wrongMahakala: `${main}wrong-mahakala`,
                    },
            secure: {
                get: `${main}secure`,
                test: `${main}secure-test`,
            },
            user: {
                set: `${rol04}set-user`,
                check: `${rol04}check-user`,
                getQr: `${rol04}get-user-qr-code`,
                setQr: `${rol04}set-user-by-qr-code`,
            },
        }
    }())
}