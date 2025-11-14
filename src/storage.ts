const checked = {
    yes: 'yes',
    no: 'no',
} as const
type CheckedKeyT = keyof typeof checked
type CheckedValuesT = typeof checked[CheckedKeyT]

type NamesValueTypeT = {
    test: string,
}

const getStorage = async () => {
    const names = {
        test: 'test',
    } as const
    type DataNamesKeysT = keyof typeof names
    type DataNamesValuesT = typeof names[DataNamesKeysT]

    const defaultData = {
        test: 'test-test',
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

    const isValidJSONParse = (str: string | string[]) => {
        try {
            JSON.stringify(str)
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
        const list = Object.keys(names)
        list.forEach((k: string) => {
            const data = get(k as DataNamesValuesT)
            if (!data && defaultData[k as keyof NamesValueTypeT]) set(k as DataNamesValuesT, defaultData[k as keyof NamesValueTypeT])
        })
    }
    initData()

    return {
        names,
        set,
        get,
    }
}