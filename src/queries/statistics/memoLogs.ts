
type MemoLogsT = {
    message: string
    command: string
    timestamp?: number
}

namespace queries {
    export namespace statistics {
        export const memoLogs = async (): Promise<MemoAnswersT> => {
            const convertLog = (log: [number, LogT]) => ({
                action: log[1].action,
                result: log[1].result,
                timestamp: log[0],
            })

            const sentAndGetData = async (logs: LogMemoT[]) => {
                const result = await api.post<MemoAnswersT>(
                    url.statistics.memoLogs,
                    { logs },
                    { withCredentials: true, }
                )

                return result.data
            }

            const logsDb = await core.idb.logs.getAllData()
            const timestampLog = await queries.statistics.getLastLogTimestamp()

            if (timestampLog.command === responseCommand.statistics.noLogs) {
                const logs: LogMemoT[] = logsDb.map(log => convertLog(log))
                await sentAndGetData(logs)

            } else {
                const logs: LogMemoT[] = logsDb
                    .filter(log => log[0] > Number(timestampLog.timestamp))
                    .map(log => convertLog(log))

                if (logs.length > 0) {
                    await sentAndGetData(logs)
                } else {
                    return null
                }
            }
        }
    }
}