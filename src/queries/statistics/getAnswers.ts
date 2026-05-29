import { url } from '../url'
import { api } from '../api'
import { AnswersMemoT } from '@/types'

export const getAnswers = async (): Promise<AnswersMemoT[]> => {

    const result = await api.get<AnswersMemoT[]>(
        url.statistics.getAnswers,
        { withCredentials: true, }
    )

    return result.data
}