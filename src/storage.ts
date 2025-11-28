const checked = {
    yes: 'yes',
    no: 'no',
} as const
type CheckedKeyT = keyof typeof checked
type CheckedValuesT = typeof checked[CheckedKeyT]

type NamesValueTypeT = {
    theme: string,
}

const storageNames = {
    theme: 'theme',
} as const
type DataNamesKeysT = keyof typeof storageNames
type DataNamesValuesT = typeof storageNames[DataNamesKeysT]

const getStorage = async () => {

    const defaultData = {
        theme: '',
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
        list.forEach((k: string) => {
            const data = get(k as DataNamesValuesT)
            if (!data && defaultData[k as keyof NamesValueTypeT]) set(k as DataNamesValuesT, defaultData[k as keyof NamesValueTypeT])
        })
    }
    initData()

    return {
        set,
        get,
    }
}