type CoreT = {
    store: Awaited<ReturnType<typeof getStorage>> | null,
    isMobile: boolean
    idb: {
        questions: Idb<QuestionDbSchemaT> | null
        images: Idb<ImageDbSchemaT> | null
        answers: Idb<AnswersDbSchemaT> | null
        statistics: Idb<any> | null
        logs: Idb<any> | null
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
        images: null,
        answers: null,
        statistics: null,
        logs: null,
    }
}
