import { RgbT, data } from './data'
import { RgbColorT, HexColorT } from '../../dom'
import { data as paramsData } from '../../engine/params'
import { AnswersT, HistoryT, rating } from '@/types'

const hexToRgb = (hex: HexColorT): RgbT => {
    const newHex = hex.trim().replace(/^#/, '') // usuwa # i białe znaki
    if (newHex.length !== 6) {
        throw new Error(`Nieprawidłowy format koloru HEX: "${hex}"`)
    }
    const bigint = parseInt(newHex, 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    }
}

const mix = (from: RgbT, to: RgbT, ratio: number) => {
    const rgb = {
        r: Math.round(from.r + (to.r - from.r) * ratio),
        g: Math.round(from.g + (to.g - from.g) * ratio),
        b: Math.round(from.b + (to.b - from.b) * ratio)
    }

    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` as RgbColorT
}

export const getColorSteps = (from: HexColorT, to: HexColorT, steps: number) => {
    const result: RgbColorT[] = []
    const ratio = 1 / (steps - 1)
    for (let i = 0; i < steps; ++i) {
        result.push(mix(hexToRgb(from), hexToRgb(to), ratio * i))
    }
    return result
}

export const getColorForThree = (answer: AnswersT) => {
    if (answer.rating) {
        if (answer.rating.type === rating.bad) {
            return data.steps.bad[answer.rating.scale] as RgbColorT
        }
        if (answer.rating.type === rating.good) {
            return data.steps.good[answer.rating.scale] as RgbColorT
        }
    }

    return data.steps.used[answer.used - 1] as RgbColorT
}

export const getColorFroOne = (answer: AnswersT) => {
    if (answer.history.length > 0) {
        const last = answer.history[answer.history.length - 1] as HistoryT

        if (last.result) {
            return data.steps.good[data.steps.good.length - 1] as RgbColorT
        } else {
            return data.steps.bad[data.steps.bad.length - 1] as RgbColorT
        }
    }

    return data.steps.used[answer.used - 1] as RgbColorT
}

export const getOnThisSession = (answer: AnswersT) =>
    paramsData.session.some(item => item.id === answer.id)