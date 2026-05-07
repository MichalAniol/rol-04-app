type GetConfigResponseT = {
    tests: string,
    img: {
        name: string,
        version: string,
    }[]
}

namespace queries {
    export namespace data {
        export const getConfig = async (): Promise<GetConfigResponseT> => {
            const result = await api.get<GetConfigResponseT>(
                url.data.config,
                { withCredentials: true, }
            )

            return result.data
        }
    }
}