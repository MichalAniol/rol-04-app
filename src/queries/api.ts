import axios from 'axios'
import { responseCommand } from './responseCommand'

const okCodes = [304, 401, 403, 429]

// baseURL: 'https://frog02-32047.wykr.es/',
// baseURL: 'https://192.168.1.109:3331/',
export const api = axios.create(
    // @ts-ignore
    {
        baseURL: process.env.API_URL,
        validateStatus: function (status: any) {
            return status >= 200 && status < 300 || okCodes.some(c => c === status)
        }
    }
)

export const nothing = {
    message: 'nieudane',
    command: responseCommand.error.none
}
