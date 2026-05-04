namespace queries {
    const okCodes = [304, 401, 403, 429]

    // @ts-ignore
    export const api = axios.create({
        baseURL: 'https://192.168.1.109:3331/',
        validateStatus: function (status: any) {
            return status >= 200 && status < 300 || okCodes.some(c => c === status)
        }
    })
}