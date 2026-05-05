type UserSetResponseT = {
    message: string
    command: string
    userId?: string
}

namespace queries {
    export namespace user {

        export const set = async (): Promise<UserSetResponseT> => {
            return await api.post<UserSetResponseT>(url.user.set,
                {},                       // body
                { withCredentials: true } // config
            )
        }
    }
}