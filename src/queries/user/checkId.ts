type UserCheckIdResponseT = {
    message: string
    command: string
}

namespace queries {
    export namespace user {
        export const checkId = async (userId: string): Promise<UserCheckIdResponseT> => {
            const result = await api.post<UserCheckIdResponseT>(
                url.user.check,
                { userId },
                { withCredentials: true, }
            )

            return result.data
        }
    }
}