import { url } from '../url'
import { api } from '../api'

type GetLastLogTimestampT = {
    message: string
    command: string
    timestamp?: string
}

export const getLastLogTimestamp = async (): Promise<GetLastLogTimestampT> => {

    const result = await api.get<GetLastLogTimestampT>(
        url.statistics.getLastLogTimestamp,
        { withCredentials: true, }
    )

    return result.data
}