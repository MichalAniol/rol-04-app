namespace utils {
    const getObjectPath = (
        keys: Array<string | number>
    ): string => {
        let path = ''

        keys.forEach((key) => {
            if (typeof key === 'number') {
                path += `[${key}]`

                return
            }

            path += path ? `.${key}` : key
        })

        return path
    }

    export const isNotNull: <V>(
        value: V | null,
        keys?: (string | number)[]
    ) => asserts value is V = (
        value,
        keys = []
    ) => {
            if (value === null) {
                console.log(
                    '%c AssertionError:',
                    'background:rgb(255, 0, 212); color: #003300',
                    `Passed value at "${getObjectPath(keys)}" is nullable`
                )
            }
        }

    export const areNotNull = (
        value: unknown,
        keys: (string | number)[] = []
    ): void => {
        isNotNull(value, keys)

        if (value === null) {
            return
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                areNotNull(item, [
                    ...keys,
                    index
                ])
            })

            return
        }

        if (typeof value === 'object') {
            Object.entries(value as Record<string, unknown>).forEach(
                ([key, nestedValue]) => {
                    areNotNull(nestedValue, [
                        ...keys,
                        key
                    ])
                }
            )
        }
    }
}