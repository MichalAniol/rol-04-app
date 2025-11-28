namespace queries {
    export namespace test {
        export const getCsrf = async () => await checkError(async () => {
            return await api.get(url.test.csrf, {
                withCredentials: true,
            })
        }, url.test.csrf)

        export const getDdos = async () => checkError(async () => {
            return await api.get(url.test.ddos, {
                withCredentials: true,
            })
        }, url.test.ddos)

        export const getDdosId = async () => checkError(async () => {
            return await api.get(url.test.ddosId, {
                withCredentials: true,
            })
        }, url.test.ddosId)

        export const getNoMahakala = async () => checkError(async () => {
            return await api.get(url.test.noMahakala, {
                withCredentials: true,
            })
        }, url.test.noMahakala)

        export const getWrongMahakala = async () => checkError(async () => {
            return await api.get(url.test.wrongMahakala, {
                withCredentials: true,
            })
        }, url.test.wrongMahakala)
    }
}