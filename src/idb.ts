// from https://github.com/jakearchibald/idb-keyval/blob/main/src/index.ts

type DBShape = Record<string, unknown>

type Idb<Schema extends DBShape> = {
    get<K extends keyof Schema>(key: K): Promise<Schema[K] | undefined>
    set<K extends keyof Schema>(key: K, value: Schema[K]): Promise<void>
    setMany<K extends keyof Schema>(entries: [K, Schema[K]][]): Promise<void>
    getMany<K extends keyof Schema>(keys: K[]): Promise<Schema[K][]>
    update<K extends keyof Schema>(key: K, updater: (oldValue: Schema[K] | undefined) => Schema[K]): Promise<void>
    del<K extends keyof Schema>(key: K): Promise<void>
    delMany<K extends keyof Schema>(keys: K[]): Promise<void>
    keys(): Promise<(keyof Schema)[]>
    values(): Promise<Schema[keyof Schema][]>
    getAllData(): Promise<{ [K in keyof Schema]: [K, Schema[K]] }[keyof Schema][]>
    clear(): Promise<void>
}

const idb = <Schema extends DBShape>(storeName: string) => (function () {
    const promisifyRequest = <T = undefined>(
        request: IDBRequest<T> | IDBTransaction,
    ): Promise<T> =>
        new Promise<T>((resolve, reject) => {
            // @ts-ignore - file size hacks
            request.oncomplete = request.onsuccess = () => resolve(request.result)
            // @ts-ignore - file size hacks
            request.onabort = request.onerror = () => reject(request.error)
        });

    const createStore = (dbName: string, storeName: string): UseStore => {
        const request = indexedDB.open(dbName);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName)
        const dbp = promisifyRequest(request);

        return (txMode, callback) =>
            dbp.then((db) =>
                callback(db.transaction(storeName, txMode).objectStore(storeName)),
            );
    };

    type UseStore = <T>(
        txMode: IDBTransactionMode,
        callback: (store: IDBObjectStore) => T | PromiseLike<T>,
    ) => Promise<T>

    let defaultGetStoreFunc: UseStore | undefined;

    const defaultGetStore = (): UseStore => {
        if (!defaultGetStoreFunc) {
            defaultGetStoreFunc = createStore('rol04', storeName)
        }
        return defaultGetStoreFunc;
    };

    const get = <T = any>(
        key: IDBValidKey,
        customStore = defaultGetStore(),
    ): Promise<T | undefined> =>
        customStore('readonly', (store) => promisifyRequest(store.get(key)))

    const set = (
        key: IDBValidKey,
        value: any,
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {
            store.put(value, key);
            return promisifyRequest(store.transaction)
        })

    const setMany = (
        entries: [IDBValidKey, any][],
        customStore = defaultGetStore(),
    ): Promise<void> => {
        return customStore('readwrite', (store) => {
            entries.forEach((entry) => store.put(entry[1], entry[0]))
            return promisifyRequest(store.transaction)
        })
    }

    const getMany = <T = any>(
        keys: IDBValidKey[],
        customStore = defaultGetStore(),
    ): Promise<T[]> => {
        return customStore('readonly', (store) =>
            Promise.all(keys.map((key) => promisifyRequest(store.get(key)))),
        );
    }

    const update = <T = any>(
        key: IDBValidKey,
        updater: (oldValue: T | undefined) => T,
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore(
            'readwrite',
            (store) =>
                new Promise((resolve, reject) => {
                    store.get(key).onsuccess = function () {
                        try {
                            store.put(updater(this.result), key);
                            resolve(promisifyRequest(store.transaction));
                        } catch (err) {
                            reject(err);
                        }
                    };
                }),
        );

    const del = (
        key: IDBValidKey,
        customStore = defaultGetStore(),
    ): Promise<void> =>
        customStore('readwrite', (store) => {
            store.delete(key);
            return promisifyRequest(store.transaction);
        });

    const eachCursor = (
        store: IDBObjectStore,
        callback: (cursor: IDBCursorWithValue) => void,
    ): Promise<void> => {
        store.openCursor().onsuccess = function () {
            if (!this.result) return;
            callback(this.result);
            this.result.continue();
        };
        return promisifyRequest(store.transaction);
    };

    const delMany = (
        keys: IDBValidKey[],
        customStore = defaultGetStore(),
    ): Promise<void> => {
        return customStore('readwrite', (store: IDBObjectStore) => {
            keys.forEach((key: IDBValidKey) => store.delete(key));
            return promisifyRequest(store.transaction);
        });
    }


    const keys = <KeyType extends IDBValidKey>(
        customStore = defaultGetStore(),
    ): Promise<KeyType[]> =>
        customStore('readonly', (store) => {
            // Fast path for modern browsers
            if (store.getAllKeys) {
                return promisifyRequest(
                    store.getAllKeys() as unknown as IDBRequest<KeyType[]>,
                );
            }

            const items: KeyType[] = [];

            return eachCursor(store, (cursor) =>
                items.push(cursor.key as KeyType),
            ).then(() => items);
        });

    const values = <T = any>(customStore = defaultGetStore()): Promise<T[]> => {
        return customStore('readonly', (store) => {
            // Fast path for modern browsers
            if (store.getAll) {
                return promisifyRequest(store.getAll() as IDBRequest<T[]>);
            }

            const items: T[] = [];

            return eachCursor(store, (cursor) => items.push(cursor.value as T)).then(
                () => items,
            );
        });
    }

    const getAllData = <KeyType extends IDBValidKey, ValueType = any>(
        customStore = defaultGetStore(),
    ): Promise<[KeyType, ValueType][]> => {
        return customStore('readonly', (store) => {
            // Fast path for modern browsers
            // (although, hopefully we'll get a simpler path some day)
            if (store.getAll && store.getAllKeys) {
                return Promise.all([
                    promisifyRequest(
                        store.getAllKeys() as unknown as IDBRequest<KeyType[]>,
                    ),
                    promisifyRequest(store.getAll() as IDBRequest<ValueType[]>),
                ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
            }

            const items: [KeyType, ValueType][] = [];

            return customStore('readonly', (store) =>
                eachCursor(store, (cursor) =>
                    items.push([cursor.key as KeyType, cursor.value]),
                ).then(() => items),
            );
        });
    }

    const clear = (customStore = defaultGetStore()): Promise<void> => {
        return customStore('readwrite', (store) => {
            store.clear();
            return promisifyRequest(store.transaction);
        });
    }

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

const db = async () => {
    type TestDbSchema = {
        user: {
            id: string
            name: string
        }
        theme: 'light' | 'dark'
        counter: number
    }

    const testDb = idb<TestDbSchema>('test')
}