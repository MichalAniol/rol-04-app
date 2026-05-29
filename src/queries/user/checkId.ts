import { url } from '../url'
import { api } from '../api'

type UserCheckIdResponseT = {
    message: string
    command: string
}

export const checkId = async (userId: string): Promise<UserCheckIdResponseT> => {
    const result = await api.post<UserCheckIdResponseT>(
        url.user.check,
        { userId },
        { withCredentials: true, }
    )

    return result.data
}
