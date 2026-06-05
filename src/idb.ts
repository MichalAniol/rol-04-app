type DBShape = Record<string, unknown>

export type Idb<Schema extends DBShape> = {
    get<K extends keyof Schema>(key: K): Promise<Schema[K] | undefined>
    set<K extends keyof Schema>(key: K, value: Schema[K]): Promise<void>
    setMany<K extends keyof Schema>(entries: [K, Schema[K]][]): Promise<void>
    updateMany<K extends keyof Schema>(entries: [K, Schema[K]][]): Promise<void>
    getMany<K extends keyof Schema>(keys: K[]): Promise<(Schema[K] | undefined)[]>
    update<K extends keyof Schema>(key: K, updater: (oldValue: Schema[K] | undefined) => Schema[K]): Promise<void>
    del<K extends keyof Schema>(key: K): Promise<void>
    delMany<K extends keyof Schema>(keys: K[]): Promise<void>
    keys(): Promise<(keyof Schema)[]>
    values(): Promise<Schema[keyof Schema][]>
    getAllData(): Promise<Array<[keyof Schema, Schema[keyof Schema] | undefined]>>
    clear(): Promise<void>
}

type UseStore = <T>(
    txMode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => T | PromiseLike<T>
) => Promise<T>

const DB_NAME = 'rol04'

const STORES = ['questions', 'images', 'answers', 'logs'] as const

const DB_VERSION = STORES.length

let dbPromise: Promise<IDBDatabase> | null = null

const promisifyRequest = <T>(
    request: IDBRequest<T> | IDBTransaction
): Promise<T> =>
    new Promise<T>((resolve, reject) => {
        const isTx =
            typeof (request as IDBTransaction).objectStoreNames !== 'undefined'

        if (isTx) {
            const tx = request as IDBTransaction

            tx.addEventListener(
                'complete',
                () => resolve(undefined as T),
                { once: true }
            )
            tx.addEventListener('error', () => reject(tx.error), {
                once: true
            })
            tx.addEventListener('abort', () => reject(tx.error), {
                once: true
            })

            return
        }

        const req = request as IDBRequest<T>

        req.addEventListener(
            'success',
            () => resolve(req.result),
            { once: true }
        )
        req.addEventListener(
            'error',
            () => reject(req.error),
            { once: true }
        )
    })

const openDb = async (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise

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

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })

    return dbPromise
}

const createStore = (storeName: string): UseStore => {
    if (!STORES.includes(storeName as any)) {
        throw new Error(`Unknown IndexedDB store "${storeName}"`)
    }

    return async (txMode, callback) => {
        const db = await openDb()
        const tx = db.transaction(storeName, txMode)
        const store = tx.objectStore(storeName)

        const result = await callback(store)

        await new Promise<void>((resolve, reject) => {
            tx.addEventListener('complete', () => resolve(), { once: true })
            tx.addEventListener('error', () => reject(tx.error), { once: true })
            tx.addEventListener('abort', () => reject(tx.error), { once: true })
        })

        return result
    }
}

export const idb = <Schema extends DBShape>(storeName: string): Idb<Schema> => {
    let cachedStore: UseStore | undefined

    const getStore = (): UseStore => {
        if (!cachedStore) cachedStore = createStore(storeName)
        return cachedStore
    }

    const get = <K extends keyof Schema>(
        key: K
    ): Promise<Schema[K] | undefined> =>
        getStore()('readonly', async store => {
            const req = store.get(key as any)
            return promisifyRequest<Schema[K] | undefined>(req)
        })

    const set = <K extends keyof Schema>(
        key: K,
        value: Schema[K]
    ): Promise<void> =>
        getStore()('readwrite', store => {
            store.put(value, key as any)
            return undefined
        })

    const setMany = <K extends keyof Schema>(
        entries: [K, Schema[K]][]
    ): Promise<void> =>
        getStore()('readwrite', store => {
            for (const [key, value] of entries) {
                store.put(value, key as any)
            }
            return undefined
        })

    const getMany = <K extends keyof Schema>(
        keys: K[]
    ): Promise<(Schema[K] | undefined)[]> =>
        getStore()('readonly', store =>
            Promise.all(
                keys.map(k =>
                    promisifyRequest<Schema[K] | undefined>(
                        store.get(k as any)
                    )
                )
            )
        )

    const update = <K extends keyof Schema>(
        key: K,
        updater: (oldValue: Schema[K] | undefined) => Schema[K]
    ): Promise<void> =>
        getStore()('readwrite', store =>
            new Promise((resolve, reject) => {
                const req = store.get(key as any)

                req.onsuccess = () => {
                    try {
                        const next = updater(req.result)
                        store.put(next, key as any)
                        resolve()
                    } catch (e) {
                        reject(e)
                    }
                }

                req.onerror = () => reject(req.error)
            })
        )

    const updateMany = <K extends keyof Schema>(
        entries: [K, Schema[K]][]
    ): Promise<void> =>
        getStore()('readwrite', store =>
            new Promise<void>((resolve, reject) => {
                let pending = entries.length
                if (pending === 0) return resolve()

                const fail = (err: any) => reject(err)

                for (const [key, value] of entries) {
                    const req = store.get(key as any)

                    req.onsuccess = () => {
                        try {
                            const oldValue = req.result
                            store.put(value, key as any)

                            pending--
                            if (pending === 0) resolve()
                        } catch (e) {
                            fail(e)
                        }
                    }

                    req.onerror = () => fail(req.error)
                }
            })
        )

    const del = <K extends keyof Schema>(key: K): Promise<void> =>
        getStore()('readwrite', store => {
            store.delete(key as any)
            return undefined
        })

    const delMany = <K extends keyof Schema>(keys: K[]): Promise<void> =>
        getStore()('readwrite', store => {
            for (const key of keys) {
                store.delete(key as any)
            }
            return undefined
        })

    const keys = (): Promise<(keyof Schema)[]> =>
        getStore()('readonly', store =>
            promisifyRequest(store.getAllKeys() as any)
        )

    const values = (): Promise<Schema[keyof Schema][]> =>
        getStore()('readonly', store =>
            promisifyRequest(store.getAll() as any)
        )

    const getAllData = (): Promise<
        Array<[keyof Schema, Schema[keyof Schema] | undefined]>
    > =>
        getStore()('readonly', async store => {
            const keys = await promisifyRequest<any[]>(store.getAllKeys())
            const values = await promisifyRequest<any[]>(store.getAll())

            return keys.map((k, i) => [k, values[i]])
        })

    const clear = (): Promise<void> =>
        getStore()('readwrite', store => {
            store.clear()
            return undefined
        })

    return {
        get,
        set,
        setMany,
        getMany,
        update,
        updateMany,
        del,
        delMany,
        keys,
        values,
        getAllData,
        clear
    }
}