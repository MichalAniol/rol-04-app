type GetLastLogTimestampT = {
    message: string
    command: string
    timestamp?: string
}

namespace queries {
    export namespace statistics {
        export const getLastLogTimestamp = async (): Promise<GetLastLogTimestampT> => {

            const result = await api.get<GetLastLogTimestampT>(
                url.statistics.getLastLogTimestamp,
                { withCredentials: true, }
            )

            return result.data
        }
    }
}



