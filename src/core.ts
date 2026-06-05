import { Idb } from "./idb"
import { getStorage } from "./storage"
import { AnswersDbSchemaT, ImageDbSchemaT, LogDbSchemaT, QuestionDbSchemaT } from "./types"

type CoreT = {
    store: Awaited<ReturnType<typeof getStorage>>
    isMobile: boolean
    idb: {
        questions: Idb<QuestionDbSchemaT>
        images: Idb<ImageDbSchemaT>
        answers: Idb<AnswersDbSchemaT>
        // statistics: Idb<any>
        logs: Idb<LogDbSchemaT>
    }
    _csrf: string
    info: string[]
}

export const core = {
    // store: null,
    isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|PlayBook|IEMobile|Windows Phone|Opera Mini|Opera Mobi|Mobile Safari|Fennec|Kindle|Silk|Ubuntu Touch/i
            .test(navigator.userAgent)
        || window.innerWidth < 768,
    idb: {},
    // _csrf: null
} as CoreT
