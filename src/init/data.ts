import { hideStatus, imgStatus, setStartImgStatus, setVersionPos, initStatus, showStatus } from '../screens/starter/starter'
import { core } from '../core'
import { getVersion } from '../queries/data/version'
import { ConfigResponseImgT, getConfig } from '../queries/data/config'
import { getAllQuestions } from '../queries/data/questions'
import { getImage } from '../queries/data/images'
import { showMenu } from '../tab/simpleMenu/simpleMenu'
import { data as engineData, updateAnswers } from '../engine/params'
import { data as statisticsData } from '../screens/statistics/data'
import { getAnswers } from '../queries/statistics/getAnswers'
import { getRateHistory } from '../screens/learning/evaluation'
import { firstUse } from '../screens/statistics/statistics'
import { checked, storageNames } from '@/storage'
import { AnswersDbT, QuestionDbT } from '@/types'
import { toString as blobToString } from '../utils/blob'
import { showInfoModal } from '@/modal/info/info'
import { getLatestTimestamp } from '@/utils/idToDate'

export const clearAnswers = async (all: boolean = false) => {
    const questions = await core.idb.questions.getAllData()

    let maxUsed = 0
    let answersDateMin = Infinity
    let answersDateMax = -Infinity

    const answersDb: [number, AnswersDbT][] = []

    for (const [index, question] of questions.entries()) {
        const key = question[0] as number
        const q = question[1] as QuestionDbT

        if (maxUsed < q.used.length + 1) {
            maxUsed = q.used.length + 1
        }

        const answer = await core.idb.answers.get(key)
        const timestamp = getLatestTimestamp([q.id, ...q.used])

        if (!answer || all) {
            answersDb.push([
                index,
                {
                    id: q.id,
                    history: [],
                    used: q.used.length + 1,
                    stamp: timestamp
                }
            ])
        } else {
            answer.stamp = timestamp
            answersDb.push([index, answer])
        }

        if (timestamp < answersDateMin) answersDateMin = timestamp
        if (timestamp > answersDateMax) answersDateMax = timestamp
    }

    const timeRange = answersDateMax - answersDateMin

    for (const answer of answersDb) {
        const originalStamp = answer[1].stamp

        const newStamp = (originalStamp - answersDateMin) / timeRange
        answer[1].stamp = newStamp
    }

    await core.idb.answers.updateMany(answersDb)

    return maxUsed
}

export const getAnswersFromServer = async () => {
    const answers = await getAnswers()
    let answersDateMin = Infinity
    let answersDateMax = -Infinity
    const answersDb: [number, AnswersDbT][] = []
    const questions = await core.idb.questions.getAllData() as [number, QuestionDbT][]

    if (answers !== null) {
        await clearAnswers(true)
        const answersOld = await core.idb.answers.getAllData() as [number, AnswersDbT][]


        for (const [, answer] of answers.entries()) {
            const oldAnswer = await answersOld.find(a => a[1].id === answer.id) as [number, AnswersDbT]

            const index = oldAnswer[0]
            const rating = getRateHistory(answer.history)
            const question = questions.find(q => q[1].id === answer.id) as [number, QuestionDbT]

            const timestamp = getLatestTimestamp([question[1].id, ...question[1].used])

            answersDb.push([index, {
                id: answer.id,
                history: answer.history,
                used: oldAnswer[1].used,
                rating,
                stamp: timestamp
            }])

            if (timestamp < answersDateMin) answersDateMin = timestamp
            if (timestamp > answersDateMax) answersDateMax = timestamp
        }
    }

    const timeRange = answersDateMax - answersDateMin

    for (const answer of answersDb) {
        const originalStamp = answer[1].stamp

        const newStamp = (originalStamp - answersDateMin) / timeRange
        answer[1].stamp = newStamp
    }

    await core.idb.answers.updateMany(answersDb)
}

export const check = async () => {
    const waitForIntervalClear = (intervalFn: (clear: () => void) => () => void, time: number) => {
        return new Promise<void>((resolve) => {
            let interval: any

            const clear = () => {
                clearInterval(interval)
                resolve()
            }
            const fn = intervalFn(clear)

            interval = setInterval(fn, time)
        })
    }

    const versionDb = await core.store.get(storageNames.version) as string

    const response = await getVersion(versionDb)
    const versionRes = response.version

    const infoVersion = core.store.get(storageNames.infoVersion)
    if (versionRes !== infoVersion && core.info.length > 0) {
        showInfoModal('Aktualizacja', core.info, true, false)
        core.store.set(storageNames.infoVersion, versionRes)
    }

    if (versionRes !== versionDb) {

        await core.store.set(storageNames.imgAvailable, checked.no)

        initStatus(versionRes)
        setTimeout(() => setVersionPos(), 200)

        // pobieranie config
        const configRes = await getConfig()
        const configTestsDb = await core.store.get(storageNames.configTests)

        if (configRes.tests !== configTestsDb) {
            showStatus()

            // pobieranie pytań
            const allQuestionsRes = await getAllQuestions()
            const allQuestions = allQuestionsRes.map(question => {
                if (!question.used) question.used = []
                return question
            })

            // zapis pytań
            const newQuestions = allQuestions.map((question, index) => [index, question] as [number, QuestionDbT])
            await core.idb.questions.setMany(newQuestions)
            await core.store.set(storageNames.configTests, configRes.tests)

            if (core.isMobile) showMenu()
        }

        setStartImgStatus()

        const imgSToAdd: ConfigResponseImgT[] = []
        await configRes.img.forEach(async (img) => {
            const imgDb = await core.idb.images.get(img.name)
            if (!imgDb || imgDb.version !== img.version) imgSToAdd.push(img)
        })

        let index = 0
        // pobieranie i zapisywanie obrazów
        const imageInterval = (clear: () => void) => async () => {
            const imageDataRes = imgSToAdd[index]
            if (!imageDataRes) {
                await core.store.set(storageNames.imgAvailable, checked.yes)

                hideStatus()

                // zapamiętanie wersji
                await core.store.set(storageNames.version, versionRes)

                clear()
                return
            }

            imgStatus(index + 1, imgSToAdd.length)
            index++

            const image = await getImage(imageDataRes.name)
            if (image) {
                await core.idb.images.set(imageDataRes.name, {
                    version: imageDataRes.version,
                    data: await blobToString(image),
                })
            }
        }
        waitForIntervalClear(imageInterval, 1000)
    }

    const maxUsed = await clearAnswers()
    engineData.quantities = Array(maxUsed).fill(0)
    engineData.sume = 0

    const questions = await core.idb.questions.getAllData() as [number, QuestionDbT][]

    // sumy rodzajów pytań
    questions.forEach(q => {
        const index = q[1].used.length;
        (engineData.quantities[index] as number)++
        engineData.sume++
    })

    await updateAnswers()

    // ilość pytań, aby ułożyć je w kwadrat
    statisticsData.monitor.size = (Math.ceil(Math.sqrt(engineData.sume)))
    firstUse()

    if (core.isMobile) showMenu()
}
