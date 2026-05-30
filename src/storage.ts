import { determinants } from './engine/params'

export const checked = {
    yes: 'yes',
    no: 'no',
} as const

export type CheckedValuesT = typeof checked[keyof typeof checked]

type NamesValueTypeT = {
    theme: string
    questionsData: CheckedValuesT
    imgData: CheckedValuesT
    imgAvailable: CheckedValuesT
    userId: string
    version: string
    configTests: string
    menuLeft: CheckedValuesT
    questionsRatio: number
    sessionStarted: CheckedValuesT
}

export const storageNames = {
    theme: 'theme',
    questionsData: 'questions-data',
    imgData: 'img-data',
    imgAvailable: 'img-available',  //
    userId: 'user-id',
    version: 'version',
    configTests: 'config-tests',
    menuLeft: 'menu-left',
    questionsRatio: 'questions-ratio',
    sessionStarted: 'session-started',
} as const

type DataNamesKeysT = keyof typeof storageNames 
export type DataNamesValuesT = typeof storageNames[DataNamesKeysT]

const START_QUESTIONS_RATIO = .85
const getQuestionsRatio = () => Math.floor(determinants.questionInSession * START_QUESTIONS_RATIO).toString()

const defaultData: NamesValueTypeT = {
    theme: '',
    questionsData: checked.yes,
    imgData: checked.yes,
    imgAvailable: checked.no,
    userId: 'null',
    version: 'null',
    configTests: 'null',
    menuLeft: checked.no,
    questionsRatio: 25,
    sessionStarted: checked.no,
}

export const getStorage = async () => {
    const isValidJSONStringify = (value: unknown): boolean => {
        try {
            const result = JSON.stringify(value)

            return result !== undefined
        } catch {
            return false
        }
    }

    const isValidJSONParse = (value: string): boolean => {
        try {
            JSON.parse(value)
            return true
        } catch {
            return false
        }
    }

    const set = <K extends keyof NamesValueTypeT>(
        key: DataNamesValuesT,
        value: NamesValueTypeT[K]
    ) => {
        if (!isValidJSONStringify(value)) {
            throw new Error(`Value for key "${key}" is not JSON serializable`)
        }

        localStorage.setItem(key, JSON.stringify(value))
    }

    const get = <K extends keyof NamesValueTypeT>(
        key: DataNamesValuesT
    ): NamesValueTypeT[K] | null => {
        const value = localStorage.getItem(key)

        if (value === null) return null

        if (!isValidJSONParse(value)) {
            return value as NamesValueTypeT[K]
        }

        return JSON.parse(value) as NamesValueTypeT[K]
    }

    const remove = (key: DataNamesValuesT) => {
        localStorage.removeItem(key)
    }

    const clear = () => {
        localStorage.clear()
    }

    const initData = () => {
        const keys = Object.keys(storageNames) as DataNamesKeysT[]

        keys.forEach((key) => {
            const keyName = storageNames[key]
            const data = get<typeof key>(keyName)

            if (data === null) {
                set<typeof key>(keyName, defaultData[key])
            }
        })

        const questionsRatio = get(storageNames.questionsRatio)
        if (questionsRatio === null) {
            set(storageNames.questionsRatio, getQuestionsRatio())
        }
    }

    initData()

    return {
        set,
        get,
        remove,
        clear,
        isValidJSONStringify,
        isValidJSONParse,
    }
}