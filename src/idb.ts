type DBShape = Record<string, unknown>

type Idb<Schema extends DBShape> = {
    get<K extends keyof Schema>(key: K): Promise<Schema[K] | undefined>
    set<K extends keyof Schema>(key: K, value: Schema[K]): Promise<void>
    setMany<K extends keyof Schema>(entries: [K, Schema[K]][]): Promise<void>
    getMany<K extends keyof Schema>(keys: K[]): Promise<Schema[K][]>
    update<K extends keyof Schema>(
        key: K,
        updater: (oldValue: Schema[K] | undefined) => Schema[K]
    ): Promise<void>
    del<K extends keyof Schema>(key: K): Promise<void>
    delMany<K extends keyof Schema>(keys: K[]): Promise<void>
    keys(): Promise<(keyof Schema)[]>
    values(): Promise<Schema[keyof Schema][]>
    getAllData(): Promise<
        { [K in keyof Schema]: [K, Schema[K]] }[keyof Schema][]
    >
    clear(): Promise<void>
}

type UseStore = <T>(
    txMode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => T | PromiseLike<T>,
) => Promise<T>

const DB_NAME = 'rol04'

/**
 * CENTRAL SCHEMA
 */
const STORES = [
    'questions',
    'images',
] as const

const DB_VERSION = STORES.length

let dbPromise: Promise<IDBDatabase> | null = null

const promisifyRequest = <T = undefined>(
    request: IDBRequest<T> | IDBTransaction,
): Promise<T> =>
    new Promise<T>((resolve, reject) => {
        // @ts-ignore
        request.oncomplete = request.onsuccess = () => resolve(request.result)

        // @ts-ignore
        request.onabort = request.onerror = () => reject(request.error)
    })

const openDb = async (): Promise<IDBDatabase> => {

    if (dbPromise) {
        return dbPromise
    }

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result

            for (const storeName of STORES) {

                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName)
                }
            }
        }

        request.onsuccess = () => {
            resolve(request.result)
        }

        request.onerror = () => {
            reject(request.error)
        }
    })

    return dbPromise
}

const createStore = (
    storeName: string,
): UseStore => {

    if (!STORES.includes(storeName as any)) {
        throw new Error(
            `Unknown IndexedDB store "${storeName}". Add it to STORES.`,
        )
    }

    return async (txMode, callback) => {
        const db = await openDb()
        const tx = db.transaction(storeName, txMode)
        const store = tx.objectStore(storeName)
        const result = await callback(store)
        await promisifyRequest(tx)

        return result
    }
}

const idb = <Schema extends DBShape>(
    storeName: string,
) => (function () {

    let defaultGetStoreFunc: UseStore | undefined

    const defaultGetStore = (): UseStore => {

        if (!defaultGetStoreFunc) {
            defaultGetStoreFunc = createStore(storeName)
        }

        return defaultGetStoreFunc
    }

    const get = <T = any>(
        key: IDBValidKey,
        customStore = defaultGetStore(),
    ): Promise<T | undefined> =>
        customStore(
            'readonly',
            (store) => promisifyRequest(store.get(key)),
        )

    const set = (
        key: IDBValidKey,
        value: any,
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {
            store.put(value, key)
            return promisifyRequest(store.transaction)
        })

    const setMany = (
        entries: [IDBValidKey, any][],
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {

            entries.forEach(([key, value]) => {
                store.put(value, key)
            })

            return promisifyRequest(store.transaction)
        })

    const getMany = <T = any>(
        keys: IDBValidKey[],
        customStore = defaultGetStore(),
    ): Promise<T[]> =>
        customStore('readonly', (store) =>
            Promise.all(
                keys.map((key) =>
                    promisifyRequest(store.get(key)),
                ),
            ),
        )

    const update = <T = any>(
        key: IDBValidKey,
        updater: (oldValue: T | undefined) => T,
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) =>
            new Promise((resolve, reject) => {
                const request = store.get(key)
                request.onsuccess = () => {
                    try {
                        store.put(
                            updater(request.result),
                            key,
                        )
                        resolve(
                            promisifyRequest(store.transaction),
                        )
                    } catch (err) {
                        reject(err)
                    }
                }

                request.onerror = () => {
                    reject(request.error)
                }
            }),
        )

    const del = (
        key: IDBValidKey,
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {
            store.delete(key)
            return promisifyRequest(store.transaction)
        })

    const delMany = (
        keys: IDBValidKey[],
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {
            keys.forEach((key) => {
                store.delete(key)
            })

            return promisifyRequest(store.transaction)
        })

    const eachCursor = (
        store: IDBObjectStore,
        callback: (cursor: IDBCursorWithValue) => void,
    ): Promise<void> => {

        store.openCursor().onsuccess = function () {
            if (!this.result) {
                return
            }

            callback(this.result)

            this.result.continue()
        }

        return promisifyRequest(store.transaction)
    }

    const keys = <KeyType extends IDBValidKey>(
        customStore = defaultGetStore(),
    ): Promise<KeyType[]> =>
        customStore('readonly', (store) => {
            if (store.getAllKeys) {

                return promisifyRequest(
                    store.getAllKeys() as unknown as IDBRequest<KeyType[]>,
                )
            }

            const items: KeyType[] = []

            return eachCursor(
                store,
                (cursor) => items.push(cursor.key as KeyType),
            ).then(() => items)
        })

    const values = <T = any>(
        customStore = defaultGetStore(),
    ): Promise<T[]> =>
        customStore('readonly', (store) => {

            if (store.getAll) {
                return promisifyRequest(
                    store.getAll() as IDBRequest<T[]>,
                )
            }

            const items: T[] = []

            return eachCursor(
                store,
                (cursor) => items.push(cursor.value as T),
            ).then(() => items)
        })

    const getAllData = <
        KeyType extends IDBValidKey,
        ValueType = any,
    >(
        customStore = defaultGetStore(),
    ): Promise<[KeyType, ValueType][]> =>
        customStore('readonly', async (store) => {
            if (store.getAll && store.getAllKeys) {

                const [keys, values] = await Promise.all([
                    promisifyRequest(
                        store.getAllKeys() as unknown as IDBRequest<KeyType[]>,
                    ),
                    promisifyRequest(
                        store.getAll() as IDBRequest<ValueType[]>,
                    ),
                ])

                return keys.map((key, i) => [
                    key,
                    values[i],
                ])
            }

            const items: [KeyType, ValueType][] = []

            return eachCursor(store, (cursor) => {

                items.push([
                    cursor.key as KeyType,
                    cursor.value,
                ])
            }).then(() => items)
        })

    const clear = (
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {
            store.clear()
            return promisifyRequest(store.transaction)
        })

    return {
        get,
        set,
        setMany,
        getMany,
        update,
        del,
        delMany,
        keys,
        values,
        getAllData,
        clear,
    }

}()) as Idb<Schema>