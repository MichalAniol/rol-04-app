namespace queries {
    export const responseState = {
        ok: 'ok',
        noNetwork: 'noNetwork',
        csrf: 'csrf',
        ddos: 'ddos',
        ddosId: 'DDoSid',
        noMahakala: 'noMahakala',
        wrongMahakala: 'wrongMahakala',
        otherProblem: 'otherProblem',
        error: 'error'
    } as const
    type ResponseStateKeysT = keyof typeof responseState
    type ResponseStateValuesT = typeof responseState[ResponseStateKeysT]

    type CheckErrorsResultT = {
        state: ResponseStateValuesT
        data: any
    }

    const baseErrorsChecker = async (promise: any) => {
        return await promise()
            .then((response: any) => {

                const okCodes = [200, 304]

                if (okCodes.includes(response?.status)) {
                    return {
                        state: responseState.ok,
                        data: response.data,
                    }
                }

                if (response?.status === 403) {
                    return {
                        state: responseState.csrf,
                        data: response.data,
                    }
                }

                if (response?.status === 429) {
                    if (response.data.command === responseCommand.main.ddos) {
                        return {
                            state: responseState.ddos,
                            data: response.data,
                        }
                    } else {
                        return {
                            state: responseState.ddosId,
                            data: response.data,
                        }
                    }
                }

                if (response?.status === 401) {
                    if (response.data.command === responseCommand.secure.noMahakala) {
                        return {
                            state: responseState.noMahakala,
                            data: response.data,
                        }
                    } else {
                        return {
                            state: responseState.wrongMahakala,
                            data: response.data,
                        }
                    }
                }

                return {
                    state: responseState.otherProblem,
                    data: response?.data,
                }
            }).catch((error: any) => {

                if (error.code === "ERR_NETWORK" || !error.response) {
                    const result: CheckErrorsResultT = {
                        state: responseState.noNetwork,
                        data: null,
                    }
                    return result
                }

                const errorState = error.response?.status ? `${responseState.error}: ${error.response?.status}` : null
                return {
                    state: errorState,
                    data: error.response?.data ?? null,
                }
            })
    }


    export const checkError = async (promise: any, endpointName?: string) => {
        const response = await baseErrorsChecker(promise)

        const canGo = true //TODO - sprawdzenie czy dane są zapisane w przeglądarce

        if (response.state === responseState.ok) {
            return response.data
        }

        // ❗ Zwracamy Promise i rozwiązujemy je dopiero po zamknięciu modala
        return new Promise((resolve) => {
            const onClose: () => null = () => {
                resolve(response?.data) // sygnał: modal zamknięty → można iść dalej
                return response.data
            }

            const getShow = (txt: string) => {
                if (endpointName) {
                    modal.error.show(`endpoint: .../${endpointName}<br><br>${txt}`, canGo, onClose)
                } else {
                    modal.error.show(txt, canGo, onClose)
                }
            }

            switch (response.state) {
                case responseState.noNetwork:
                    getShow('Brak dostępu do sieci.')
                    break
                case responseState.csrf:
                    getShow('CSRF token jest błędny.')
                    break
                case responseState.ddos:
                    getShow('Przekroczono limit zapytań do serwera. Limit zrestartuje się za godzinę.')
                    break
                case responseState.ddosId:
                    getShow('Przekroczono limit tworzenia uzytkownikow na dzień.  Limit zrestartuje się za 24 godziny')
                    break
                case responseState.noMahakala:
                    getShow('Brak mahakala token')
                    break
                case responseState.wrongMahakala:
                    getShow('Wadliwy mahakala token')
                    break
                case responseState.otherProblem:
                    getShow('Nieznany problem.')
                    break
                case responseState.error:
                    getShow(response.state)
                    break
            }
        })
    }
}
