type ConfigResponseImgT = {
    name: string,
    version: string,
}


type GetConfigResponseT = {
    tests: string,
    img: ConfigResponseImgT[]
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