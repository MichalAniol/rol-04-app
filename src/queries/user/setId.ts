namespace queries {
    export namespace user {
        export const set = async () => {
            return await api.post(url.user.set,
                {},                       // body
                { withCredentials: true } // config
            )
        }
    }
}