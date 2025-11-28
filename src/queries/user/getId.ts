namespace queries {
    export namespace user {
        export const getId = async () => {
            return await api.get(url.user.check, {
                withCredentials: true,
            })
        }
    }
}