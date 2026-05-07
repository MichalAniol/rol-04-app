type QuestionResponseT = {
    version: string,
    question: string,
    answer: string,
    falseAnswers: [string, string, string],
    firstUsed: string,
    used: string[]
}

type QuestionDbSchemaT = {
    [key: string]: QuestionResponseT
}

type CoreT = {
    store: Awaited<ReturnType<typeof getStorage>> | null,
    isMobile: boolean
    idb: {
        questions: Idb<QuestionDbSchemaT> | null
        // answers: Idb<GetQuestionResponseT> | null
        // statistics: Idb<GetQuestionResponseT> | null
    }
}

namespace core {
    export let store: CoreT["store"] = null;

    export const isMobile: CoreT["isMobile"] =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|PlayBook|IEMobile|Windows Phone|Opera Mini|Opera Mobi|Mobile Safari|Fennec|Kindle|Silk|Ubuntu Touch/i
            .test(navigator.userAgent)
        || window.innerWidth < 768;

    export const idb: CoreT["idb"] = {
        questions: null,
        // answers: null,
        // statistics: null,
    }
}
