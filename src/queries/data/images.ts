import { url } from '../url'
import { api } from '../api'

export const getImage = async (name: string): Promise<Blob> => {
    const result = await api.post<Blob>(
        url.data.images,
        { name },
        {
            withCredentials: true,
            responseType: 'blob',
        }
    )

    return result.data
}