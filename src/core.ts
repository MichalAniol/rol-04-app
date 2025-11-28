type CoreT = {
    store: Awaited<ReturnType<typeof getStorage>> | null,
    idbTest: any,
    isMobile: boolean
}

namespace core {
    export let store: CoreT["store"] = null;
    export let idbTest: CoreT["idbTest"] = null;

    export const isMobile: CoreT["isMobile"] =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|PlayBook|IEMobile|Windows Phone|Opera Mini|Opera Mobi|Mobile Safari|Fennec|Kindle|Silk|Ubuntu Touch/i
            .test(navigator.userAgent)
        || window.innerWidth < 768;
}
