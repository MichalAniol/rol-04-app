namespace queries {
    export namespace secure {
        export const secureTest = async (): Promise<any> => {
            try {
                // @ts-ignore
                const response = await api.post(url.secure.test, {
                    withCredentials: true,
                })
                const data = response.data
                console.log('---->>> ', data)
                return data
            } catch (error) {
                console.error('Błąd podczas pobierania konfiguracji:', error)
                return null
            }
        }
    }
}