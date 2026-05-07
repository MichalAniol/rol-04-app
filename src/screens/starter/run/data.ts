namespace starter {
    export namespace data {
        export const check = async () => {
            const versionDb = await core.store.get(storageNames.version) as string

            const response = await queries.data.getVersion(versionDb)
            const versionRes = response.version

            if (versionRes !== versionDb) {
                const configRes = await queries.data.getConfig()
                const configDb = await core.store.get(storageNames.config) as GetConfigResponseT
                console.log('%c configDb:', 'background: #ffcc00; color: #003300', configDb)

                if (configRes.tests !== configDb.tests) {

                }
            }
        }
    }
}