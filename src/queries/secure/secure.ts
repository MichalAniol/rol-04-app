namespace queries {
    export namespace secure {
        export const getSecure = async () => checkError(async () => {
            return await api.get(url.secure.get, {
                withCredentials: true,
            })
        })
    }
}