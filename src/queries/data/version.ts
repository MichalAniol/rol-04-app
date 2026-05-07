type GetVersionResponseT = {
    message: string
    command: string
    version: string
}

namespace queries {
    export namespace data {
        export const getVersion = async (version: string): Promise<GetVersionResponseT> => {
            const result = await api.post<GetVersionResponseT>(
                url.data.version,
                { version },
                { withCredentials: true, }
            )

            return result.data
        }
    }
}