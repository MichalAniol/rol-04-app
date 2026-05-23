type TensorDataT = {
    id: string;
    index: number       // index
    used?: number       // ile razy użyto
    lastUsed?: number   // timestamp
    nextUse?: number    // timestamp
    appearance?: number // 0–1
    rating?: number;    // 0–1
    score?: number
}

type WeightsKeyT = keyof WeightsT

type QuestionDbT = {
    id: string
    version: string
    question: string
    answer: string
    falseAnswers: [string, string, string]
    firstUsed: string
    used: string[]
    img?: string
}

type QuestionDbSchemaT = {
    [key: number]: QuestionDbT
}

type ImageDbT = {
    version: string
    data: string
}

type ImageDbSchemaT = {
    [key: string]: ImageDbT
}

const rating= {
    bad: 'bad',
    good: 'good'
} as const
const ratingNames = Object.values(rating)
type RatingNameT = typeof ratingNames[number]

type RatingT = {
    type: RatingNameT
    scale: number
}

type HistoryT = {
    timestamp: number
    result: boolean
}

type AnswersDbT = {
    id: string // zgodne z pytaniem
    history: HistoryT[]
    expectedUse: number
    used: number
    rating?: RatingT | null // ocena do wyświetlania koloru na statystykach
}

type AnswersT = AnswersDbT & {
    drawn: boolean // do usuwania już wylogowany w następnych turach tej samej sesji
    index: number  // zgodny z pytaniem
}

type AnswersDbSchemaT = {
    [key: number]: AnswersDbT
}

type LearningT = {
    question: QuestionDbT
    answer: AnswersT
    index: number
}

type LogT = {
    action: string
    result: boolean
    status: number
}

type LogDbSchemaT = {
    [key: number]: LogT
}