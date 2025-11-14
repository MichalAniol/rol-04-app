
// console.log('%c serverUrl:', 'background: #ffcc00; color: #003300', process.env.SERVER_URL)

const initAndGetData = async () => {
    let config: {
        version: string,
        tests: {
            version: string
            name: string
        }[],
        img: {
            version: string
            name: string
        }[]
    }

    function getCookie(name: string) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        console.log('%c document.cookie:', 'background: #ffcc00; color: #003300', document.cookie)
        return match ? match[2] : null;
    }



    const getSecure = async (): Promise<any> => {
        try {
            // @ts-ignore
            const response = await axios.get(`${glob.serverUrl}secure`, {
                withCredentials: true,
            })
            const data = response.data
            console.log(data)
            return data
        } catch (error) {
            console.error('Błąd podczas pobierania konfiguracji:', error)
            return null
        }
    }

    const secureTest = async (): Promise<any> => {
        try {
            // @ts-ignore
            const response = await axios.post(`${glob.serverUrl}secure-test`, {
                withCredentials: true,
            })
            const data = response.data
            console.log('---->>> ',data)
            return data
        } catch (error) {
            console.error('Błąd podczas pobierania konfiguracji:', error)
            return null
        }
    }

    // const getConfig = async (): Promise<any> => {
    //     try {
    //         // @ts-ignore
    //         const response = await axios.get(`${glob.serverUrl}tests/get-config`)
    //         const data = response.data
    //         console.log(data)
    //         return data
    //     } catch (error) {
    //         console.error('Błąd podczas pobierania konfiguracji:', error)
    //         return null
    //     }
    // }

    // const processTests = async () => {
    //     if (config && config.tests) {
    //         for (const test of config.tests) {
    //             try {
    //                 // Sprawdzenie, czy wersja testu już istnieje w IndexedDB
    //                 const existingVersion = await core.idbTest.get(`${test.name}-v`)
    //                 if (!existingVersion) {
    //                     // @ts-ignore
    //                     const response = await axios.get(`${glob.serverUrl}tests/get-one?name=${test.name}`)
    //                     const testData = response.data

    //                     await core.idbTest.set(test.name, testData)
    //                     await core.idbTest.set(`${test.name}-v`, test.version)

    //                     console.log(`Test ${test.name} zapisany w IndexedDB`)
    //                 } else {
    //                     console.log(`Test ${test.name} już istnieje w IndexedDB (wersja: ${existingVersion})`)
    //                 }

    //                 // Czekaj 0.5 sekundy przed przetworzeniem kolejnego testu
    //                 await new Promise(resolve => setTimeout(resolve, 500))
    //             } catch (error) {
    //                 console.error(`Błąd przy przetwarzaniu testu ${test.name}:`, error)
    //             }
    //         }
    //     }
    // }

    getSecure()
    setTimeout(secureTest, 1000)

    // config = await getConfig()
    // processTests()

    // getConfig()
}