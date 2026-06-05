import { changeVisibility } from '@/tab/simpleMenu/visible'
import { add } from '../dom'
import { goRight, goLeft } from '@/tab/tab'
import { core } from '@/core'
import { storageNames } from '@/storage'
import { data, setQuestion } from '@/screens/learning/preparation'
import { HistoryT, LearningT } from '@/types'
import { clearResults, confirmClick, getRateHistory, mark } from '@/screens/learning/evaluation'

const keysListener = async (event: any) => {
    console.log('%c event.code:', 'background:rgb(234, 0, 255); color: #003300', event.code)
    switch (event.code) {
        // case 'Tab': {
        //     event.preventDefault()      // blokuje defaultowe przenoszenie fokusu
        // } break
        case 'Tab': {
            changeVisibility()
        } break
        case 'ArrowRight':
        case 'KeyD': {
            goRight()
            // console.log('goRight')
        } break
        case 'ArrowLeft':
        case 'KeyA': {
            goLeft()
            // console.log('goLeft')
        } break

    }

    if (process.env.DEBUG === "true") {

        switch (event.code) {
            case 'Digit1': {
                mark(0)()
            } break
            case 'Digit2': {
                mark(1)()
            } break
            case 'Digit3': {
                mark(2)()
            } break
            case 'Digit4': {
                mark(3)()
            } break
            case 'Space': {
                if (data.mark > -1) {
                    confirmClick()
                }
            } break
            case 'KeyQ': {
                // console.log('%c>>> KeyQ <<<', 'background:rgb(0, 55, 255); color: #003300')
                const sessionStarted = await core.store.get(storageNames.sessionStarted)
                if (sessionStarted) {
                    const timestamp = Date.now()
                    data.answers.origin?.answer.history.push({
                        timestamp,
                        result: true,
                    })

                    const rate = getRateHistory(data.answers.origin?.answer.history as HistoryT[]);
                    (data.answers.origin as LearningT).answer.rating = rate

                    // zapis w pytaniach
                    const { drawn, index, ...answerDb } = (data.answers.origin as LearningT).answer
                    // @ts-ignore
                    core.idb.answers.update(index, (old) => old = answerDb)


                    const log = {
                        action: (data.answers.origin as LearningT).answer.id,
                        result: true,
                    }

                    // zapis loga
                    core.idb.logs.set(timestamp, log)

                    clearResults()
                    setQuestion()

                } break
            }
        }
    }
}

export const controllers = {
    keysListener,
    initKeys: () => {
        add(document, 'keydown', keysListener)
    }
}