namespace statistics {
    export namespace helpers {
        const hexToRgb = (hex: dom.HexColorT): RgbT => {
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

            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` as dom.RgbColorT
        }

        export const getColorSteps = (from: dom.HexColorT, to: dom.HexColorT, steps: number) => {
            const result: dom.RgbColorT[] = []
            const ratio = 1 / (steps - 1)
            for (let i = 0; i < steps; ++i) {
                result.push(mix(hexToRgb(from), hexToRgb(to), ratio * i))
            }
            return result
        }

        export const getColor = (answer: AnswersDbT) => {
            // if (answer.rating) {
            //     const sortedHistory = [...answer.history].sort((a, b) => b.timestamp - a.timestamp)
            //     const lastRequiredHistory = sortedHistory.slice(0, engine.params.determinants.numLastRequiredQuestions)

            //     const lastHighlyRatedHistory = sortedHistory.slice(engine.params.determinants.numLastRequiredQuestions, engine.params.determinants.numLastHighlyRatedQuestions)

            //     return data.steps.bad[0]
            // }

            return data.steps.used[answer.used - 1]
        }
    }
}