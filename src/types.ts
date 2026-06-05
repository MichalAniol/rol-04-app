export type WeightsT = {
    lastUsed: number,
    nextUse: number,
    appearance: number,
    rating: number,
    littleUsed: number,
    newer: number,
    temperature: number,
}

export type WeightsKeyT = keyof WeightsT

export type TensorDataT = {
    id: string;
    index: number       // index
    used?: number       // ile razy użyto
    lastUsed?: number   // timestamp
    nextUse?: number    // timestamp
    appearance?: number // 0–1
    rating?: number;    // 0–1
    score?: number
    newer?: number
}

export type QuestionDbT = {
    id: string
    version: string
    question: string
    answer: string
    falseAnswers: [string, string, string]
    firstUsed: string
    used: string[]
    img?: string
}

export type QuestionDbSchemaT = Record<number, QuestionDbT>

export type ImageDbT = {
    version: string
    data: string
}

export type ImageDbSchemaT = Record<string, ImageDbT>

export const rating = {
    bad: 'bad',
    good: 'good'
} as const
const ratingNames = Object.values(rating)
type RatingNameT = typeof ratingNames[number]

export type RatingT = {
    type: RatingNameT
    scale: number
}

export type HistoryT = {
    timestamp: number
    result: boolean
}

export type AnswersMemoT = {
    id: string // zgodne z pytaniem
    history: HistoryT[]
}

export type AnswersDbT = AnswersMemoT & {
    // expectedUse: number
    used: number // ile razy było użyte w różnych testach
    stamp: number // data ostatniego testu w którym zostało pytanie uzyte
    rating?: RatingT | null // ocena do wyświetlania koloru na statystykach
}

export type AnswersT = AnswersDbT & {
    drawn: boolean // do usuwania już wylogowany w następnych turach tej samej sesji
    index: number  // zgodny z pytaniem
}

export type AnswersDbSchemaT = Record<number, AnswersDbT>

export type LearningT = {
    question: QuestionDbT
    answer: AnswersT
    index: number
}

export type LogT = {
    action: string
    result: boolean
}

export type LogDbSchemaT = Record<number, LogT>

export type LogMemoT = LogT & {
    timestamp: number
}