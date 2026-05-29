import { url } from '../url'
import { api } from '../api'
import { checkError } from '../error'

type SecureGetResponseT = {
    message: string
    command: string
    userId?: string
}

export const getSecure = async (): Promise<SecureGetResponseT> => checkError(async () => {
    return await api.get<SecureGetResponseT>(url.secure.get, {
        withCredentials: true,
    })
})
