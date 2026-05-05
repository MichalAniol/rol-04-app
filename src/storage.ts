const checked = {
    yes: 'yes',
    no: 'no',
} as const
type CheckedKeyT = keyof typeof checked
type CheckedValuesT = typeof checked[CheckedKeyT]

type NamesValueTypeT = {
    theme: string,
    questionsData: CheckedValuesT,
    imgData: CheckedValuesT,
    userId: string
}

const storageNames = {
    theme: 'theme',
    questionsData: 'questions-data',
    imgData: 'img-data',
    userId: 'user-id'
} as const
type DataNamesKeysT = keyof typeof storageNames
type DataNamesValuesT = typeof storageNames[DataNamesKeysT]

const getStorage = async () => {

    const defaultData = {
        theme: '',
        questionsData: checked.yes,
        imgData: checked.yes,
        userId: 'null',
    } as const

    const isValidJSONStringify = (str: string | string[]) => {
        try {
            JSON.stringify(str)
            return true;
        } catch {
            return false
        }
    }

    const set = <K extends keyof NamesValueTypeT, V extends NamesValueTypeT[K]>(key: DataNamesValuesT, value: V) => {
        if (isValidJSONStringify(value)) {
            localStorage.setItem(key, JSON.stringify(value))
        } else {
            localStorage.setItem(key, value.toString())
        }
    }

    const isValidJSONParse = (str: string) => {
        try {
            JSON.parse(str)
            return true
        } catch {
            return false
        }
    }

    const get = (key: DataNamesValuesT) => {
        const value = localStorage.getItem(key)
        if (!value) return null
        if (typeof value === 'boolean') return `${value}`
        if (isValidJSONParse(value)) {
            return JSON.parse(value)
        } else {
            return value.toString()
        }
    }

    const initData = () => {
        const list = Object.keys(storageNames)
        console.log('%c list:', 'background: #ffcc00; color: #003300', list)
        list.forEach((key: DataNamesKeysT) => {
            const keyName = storageNames[key]

            const data = get(keyName)
            console.log('%c data:', 'background: #ffcc00; color: #003300', data)

            if (!data && defaultData[key]) {
                set(keyName, defaultData[key])
            }
        })
    }
    initData()

    return {
        set,
        get,
    }
}