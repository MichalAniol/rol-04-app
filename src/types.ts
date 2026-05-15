type TensorDataT = {
    id: string;
    i: number; // index
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
    id: string
    history: {
        timestamp: number,
        result: boolean,
    }[],
    expectedUse: number,
    used: number
}

type AnswersT = AnswersDbT & {
    drawn: boolean,
    index: number,
    rating?: null,
}

type AnswersDbSchemaT = {
    [key: number]: AnswersDbT
}

