import { url } from '../url'
import { api } from '../api'

type UserSetResponseT = {
    message: string
    command: string
    userId?: string
}

//FIXME - withCredentials do globalnej funkcji
export const set = async (): Promise<UserSetResponseT> => {
    const result = await api.post<UserSetResponseT>(url.user.set,
        {},                       // body
        { withCredentials: true } // config
    )

    return result.data
}
