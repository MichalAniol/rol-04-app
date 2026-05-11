const checked = {
    yes: 'yes',
    no: 'no',
} as const

type CheckedValuesT = typeof checked[keyof typeof checked]

type NamesValueTypeT = {
    theme: string
    questionsData: CheckedValuesT
    imgData: CheckedValuesT
    userId: string
    version: string
    config: GetConfigResponseT
    menuLeft: CheckedValuesT
}

const storageNames = {
    theme: 'theme',
    questionsData: 'questions-data',
    imgData: 'img-data',
    userId: 'user-id',
    version: 'version',
    config: 'config',
    menuLeft: 'menu-left',
} as const

type DataNamesKeysT = keyof typeof storageNames
type DataNamesValuesT = typeof storageNames[DataNamesKeysT]

const configData: GetConfigResponseT = {
    tests: 'null',
    img: [],
}

const defaultData: NamesValueTypeT = {
    theme: '',
    questionsData: checked.yes,
    imgData: checked.yes,
    userId: 'null',
    version: 'null',
    config: configData,
    menuLeft: checked.no,
}

const getStorage = async () => {

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