type SecureGetResponseT = {
    message: string
    command: string
    userId?: string
}

namespace queries {
    export namespace secure {

        export const getSecure = async (): Promise<SecureGetResponseT> => checkError(async () => {
            return await api.get<SecureGetResponseT>(url.secure.get, {
                withCredentials: true,
            })
        })
    }
}