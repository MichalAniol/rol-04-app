import { url } from '../url'
import { api } from '../api'

export type ConfigResponseImgT = {
    name: string,
    version: string,
}

export type GetConfigResponseT = {
    tests: string,
    img: ConfigResponseImgT[]
}

export const getConfig = async (): Promise<GetConfigResponseT> => {
    const result = await api.get<GetConfigResponseT>(
        url.data.config,
        { withCredentials: true, }
    )

    return result.data
}