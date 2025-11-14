type CoreT = {
    store: Awaited<ReturnType<typeof getStorage>> | null,
    idbTest: any
}

const core: CoreT = {
    store: null,
    idbTest: null,
}