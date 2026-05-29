import { HexColorT, RgbColorT } from "@/dom"

export type RgbT = {
    r: number,
    g: number,
    b: number
}

type ColorsRangeT = {
    min: HexColorT,
    max: HexColorT,
}

type BaseHexColorsT = {
    used: ColorsRangeT
    bad: ColorsRangeT
    good: ColorsRangeT
}

export type GradientStepsT = {
    used: RgbColorT[]
    bad: RgbColorT[]
    good: RgbColorT[]
}

type PosT = {
    x: number
    y: number
}

type DataT = {
    background: HexColorT
    base: BaseHexColorsT
    steps: GradientStepsT
    monitor: {
        size: number
        width: number
        pos: PosT
    },
    cell: {
        size: number
        space: number
        all: number
    }
}

export const data = {
    // background: null,
    base: {
        used: {} as ColorsRangeT,
        bad: {} as ColorsRangeT,
        good: {} as ColorsRangeT,
    },
    steps: {
        used: [],
        bad: [],
        good: [],
    },
    monitor: {
        size: 0,
        width: 0,
        pos: {
            x: 0,
            y: 0,
        },

    },
    cell: {
        size: 0,
        space: 0,
        all: 0,
    },
} as unknown as DataT

export const determinants = {
    cell: {
        size: 20,
        space: 2,
    }
} as const