type TensorDataT = {
    id: string;
    index: number; // index
    used?: number; // ile razy użyto
    lastUsed?: number;     // timestamp
    nextUse?: number;      // timestamp
    appearance?: number;   // 0–1
    rating?: number;       // 0–1
    score?: number;
}

type WeightsKeyT = keyof WeightsT

type QuestionDbT = {
    id: string
    version: string,
    question: string,
    answer: string,
    falseAnswers: [string, string, string],
    firstUsed: string,
    used: string[],
    img?: string,
}

type QuestionDbSchemaT = {
    [key: number]: QuestionDbT
}

type ImageDbT = {
    version: string,
    data: Blob,
}

type ImageDbSchemaT = {
    [key: string]: ImageDbT
}

type AnswersDbT = {
    id: string // zgodne z pytaniem
    history: {
        timestamp: number,
        result: boolean,
    }[],
    expectedUse: number,
    used: number
    rating?: null, // ocena do wyświetlania koloru na statystykach
}

type AnswersT = AnswersDbT & {
    drawn: boolean, // do usuwania już wylogowany w następnych turach tej samej sesji
    index: number, // zgodny z pytaniem
}

type AnswersDbSchemaT = {
    [key: number]: AnswersDbT
}

