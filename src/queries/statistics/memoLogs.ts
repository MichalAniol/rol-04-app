import { url } from '../url'
import { api, nothing } from '../api'
import { responseCommand } from '../responseCommand'
import { LogT } from '@/types'
import { core } from '@/core'
import { getLastLogTimestamp } from './getLastLogTimestamp'
import { MemoAnswersT } from './memoAnswers'

export const memoLogs = async (): Promise<MemoAnswersT> => {
    const convertLog = (log: [number, LogT]) => ({
        action: log[1].action,
        result: log[1].result,
        timestamp: log[0],
    } as LogT)

    const sentAndGetData = async (logs: LogT[]) => {
        const result = await api.post<MemoAnswersT>(
            url.statistics.memoLogs,
            { logs },
            { withCredentials: true, }
        )

        return result.data
    }

    const logsDb = await core.idb.logs.getAllData()
    const timestampLog = await getLastLogTimestamp()

    if (timestampLog.command === responseCommand.statistics.noLogs) {
        const logs: LogT[] = logsDb.map(log => convertLog(log))
        await sentAndGetData(logs)

    } else {
        const logs: LogT[] = logsDb
            .filter((log) => log[0] > Number(timestampLog.timestamp))
            .map((log) => convertLog(log))

        if (logs.length > 0) {
            await sentAndGetData(logs)
        }
    }

    return nothing
}