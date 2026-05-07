namespace queries {
    export namespace data {
        export const getImage = async (name: string): Promise<Blob> => {
            const result = await api.post<Blob>(
                url.data.images,
                { name },
                { withCredentials: true, }
            )

            return result.data
        }
    }
}