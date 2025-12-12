namespace settings {
    export namespace dataControl {
        const { byId, byQuery, getPx, setStyle } = dom

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
        }

        // @ts-ignore
        const imgNames = Object.values(ids.img) as const

        const controlImgData: RadioDataT = {
            prefix: ids.prefix,
            storeName: storageNames.imgData,
            elementList: imgNames,
            nameList: valuesList,
        }

        export let questionsRatio: RatioT
        export let imgRatio: RatioT

        export const init = () => {
            questionsRatio = utils.getRadio(controlQuestionsData)
            questionsRatio.init()

            imgRatio = utils.getRadio(controlImgData)
            imgRatio.init()
        }
    }
}