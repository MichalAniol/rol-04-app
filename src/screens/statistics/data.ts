namespace statistics {
    export type RgbT = {
        r: number,
        g: number,
        b: number
    }


    type ColorsRangeT = {
        min: dom.HexColorT | null,
        max: dom.HexColorT | null,
    }

    type BaseHexColorsT = {
        used: ColorsRangeT | null
        bad: ColorsRangeT | null
        good: ColorsRangeT | null
    }

    export type GradientStepsT = {
        used: dom.RgbColorT[]
        bad: dom.RgbColorT[]
        good: dom.RgbColorT[]
    }

    type DataT = {
        background: dom.HexColorT
        base: BaseHexColorsT
        steps: GradientStepsT
        monitor: {
            size: number
            width: number
        },
        cell: {
            size: number
            space: number
        }
    }

    export const data: DataT = {
        background: null,
        base: {
            used: { min: null, max: null },
            bad: { min: null, max: null },
            good: { min: null, max: null },
        },
        steps: {
            used: [],
            bad: [],
            good: [],
        },
        monitor: {
            size: 0,
            width: 0,
        },
        cell: {
            size: 0,
            space: 0,
        }
    }

    export const determinants = {
        cell: {
            size: 20,
            space: 2,
        }
    } as const
}