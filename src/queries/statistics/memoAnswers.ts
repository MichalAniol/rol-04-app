import { url } from '../url'
import { api, nothing } from '../api'
import { AnswersMemoT, HistoryT } from '@/types'
import { core } from '@/core'
import { determinants } from '@/engine/params'

export type MemoAnswersT = {
    message: string
    command: string
}

export const memoAnswers = async (): Promise<MemoAnswersT> => {
    const answersDb = await core.idb.answers.getAllData()
    const answers: AnswersMemoT[] = []

    answersDb.forEach(answer => {
        const history = answer[1].history
        const sortedHistory = history
            .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))

        const lastSix: HistoryT[] = sortedHistory.slice(-determinants.numLastHighlyRatedQuestions)

        if (history.length > 0) {
            answers.push({
                id: answer[1].id,
                history: lastSix,
            })
        }
    })

    if (answers.length > 0) {
        const result = await api.post<MemoAnswersT>(
            url.statistics.memoAnswers,
            { answers: answers },
            { withCredentials: true, }
        )

        return result.data
    }

    return nothing
}
