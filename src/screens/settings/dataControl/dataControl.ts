import { checked, storageNames } from '@/storage'
import {getRadio, RadioDataT, RatioT} from '../../../utils/radio'

const ids = {
    prefix: 'setting-data-',
    questions: {
        offline: 'questions-offline',
        online: 'questions-online',
    },
    img: {
        offline: 'img-offline',
        online: 'img-online',
    },
}

const valuesList = [checked.yes, checked.no]

// @ts-ignore
const questionsNames = Object.values(ids.questions) as const

const controlQuestionsData: RadioDataT = {
    prefix: ids.prefix,
    storeName: storageNames.questionsData,
    elementList: questionsNames,
    nameList: valuesList,
    clickList: []
}

// @ts-ignore
const imgNames = Object.values(ids.img) as const

const controlImgData: RadioDataT = {
    prefix: ids.prefix,
    storeName: storageNames.imgData,
    elementList: imgNames,
    nameList: valuesList,
    clickList: []
}

export let questionsRatio: RatioT
export let imgRatio: RatioT

export const init = () => {
    questionsRatio = getRadio(controlQuestionsData)
    questionsRatio.init()

    imgRatio = getRadio(controlImgData)
    imgRatio.init()
}
