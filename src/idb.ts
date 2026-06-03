type DBShape = Record<string, unknown>

export type Idb<Schema extends DBShape> = {
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
    getAllData(): Promise<Array<{ [K in keyof Schema]: [K, Schema[K]] }[keyof Schema]>>
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

const promisifyRequest = <T = unknown>(
    request: IDBRequest<T> | IDBTransaction
): Promise<T> =>
    new Promise<T>((resolve, reject) => {
        const tx = request as IDBTransaction
        const req = request as IDBRequest<T>

        const isTx = typeof (request as any).objectStoreNames !== 'undefined'

        if (isTx) {
            const done = () => resolve(undefined as T)

            tx.addEventListener('complete', done, { once: true })
            tx.addEventListener('error', () => reject(tx.error), { once: true })
            tx.addEventListener('abort', () => reject(tx.error), { once: true })

            return
        }

        req.addEventListener('success', () => resolve(req.result), { once: true })
        req.addEventListener('error', () => reject(req.error), { once: true })
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

export const idb = <Schema extends DBShape>(storeName: string) => {
    let cachedStore: UseStore | undefined

    const getStore = (): UseStore => {
        if (!cachedStore) cachedStore = createStore(storeName)
        return cachedStore
    }

    const get = <T = any>(
        key: IDBValidKey | null | undefined,
        store = getStore()
    ): Promise<T | null> => {
        if (key == null) return Promise.resolve(null)

        return store('readonly', async store => {
            const req = store.get(key)
            const res = await promisifyRequest<T | undefined>(req)
            return res ?? null
        })
    }

    const set = (
        key: IDBValidKey,
        value: any,
        store = getStore()
    ): Promise<void> =>
        store('readwrite', store => {
            store.put(value, key)
            return undefined
        })

    const setMany = (
        entries: [IDBValidKey, any][],
        store = getStore()
    ): Promise<void> =>
        store('readwrite', store => {
            for (const [key, value] of entries) {
                store.put(value, key)
            }
            return undefined
        })

    const getMany = <T = any>(
        keys: IDBValidKey[],
        store = getStore()
    ): Promise<T[]> =>
        store('readonly', store =>
            Promise.all(keys.map(k => promisifyRequest<T | undefined>(store.get(k))))
                .then(res => res.map(v => (v ?? undefined) as T))
        )

    const update = <T = any>(
        key: IDBValidKey,
        updater: (oldValue: T | undefined) => T,
        store = getStore()
    ): Promise<void> =>
        store('readwrite', store => {
            return new Promise((resolve, reject) => {
                const req = store.get(key)

                req.onsuccess = () => {
                    try {
                        const next = updater(req.result)
                        store.put(next, key)
                        resolve()
                    } catch (e) {
                        reject(e)
                    }
                }

                req.onerror = () => reject(req.error)
            })
        })

    const del = (key: IDBValidKey, store = getStore()): Promise<void> =>
        store('readwrite', store => {
            store.delete(key)
            return undefined
        })

    const delMany = (
        keys: IDBValidKey[],
        store = getStore()
    ): Promise<void> =>
        store('readwrite', store => {
            for (const key of keys) store.delete(key)
            return undefined
        })

    const eachCursor = (
        store: IDBObjectStore,
        cb: (cursor: IDBCursorWithValue) => void
    ): Promise<void> =>
        new Promise((resolve, reject) => {
            const req = store.openCursor()

            req.onerror = () => reject(req.error)

            req.onsuccess = () => {
                const cursor = req.result
                if (!cursor) return resolve()
                cb(cursor)
                cursor.continue()
            }
        })

    const keys = <K extends IDBValidKey>(
        store = getStore()
    ): Promise<K[]> =>
        store('readonly', store => {
            if (store.getAllKeys) {
                return promisifyRequest(store.getAllKeys() as any)
            }

            const out: K[] = []

            return eachCursor(store, c => out.push(c.key as K)).then(() => out)
        })

    const values = <T = any>(
        store = getStore()
    ): Promise<T[]> =>
        store('readonly', store => {
            if (store.getAll) {
                return promisifyRequest(store.getAll() as any)
            }

            const out: T[] = []

            return eachCursor(store, c => out.push(c.value as T)).then(() => out)
        })

    const getAllData = <K extends IDBValidKey, V = any>(
        store = getStore()
    ): Promise<[K, V | undefined][]> =>
        store('readonly', async store => {
            if (store.getAll && store.getAllKeys) {
                const [keys, values] = await Promise.all([
                    promisifyRequest<K[]>(store.getAllKeys() as any),
                    promisifyRequest<V[]>(store.getAll() as any)
                ])

                return keys.map((k, i) => [k, values[i]])
            }

            const out: [K, V][] = []

            return eachCursor(store, c => {
                out.push([c.key as K, c.value as V])
            }).then(() => out)
        })

    const clear = (store = getStore()): Promise<void> =>
        store('readwrite', store => {
            store.clear()
            return undefined
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
        clear
    }
} 