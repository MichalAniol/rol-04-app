export const url = (function () {
    const main = `api/`
    // const rol04 = `rol04/api/`

    return {
        test: {
            csrf: `${main}csrf`,
            ddos: `${main}ddos`,
            ddosId: `${main}ddos-id`,
            noMahakala: `${main}no-mahakala`,
            wrongMahakala: `${main}wrong-mahakala`,
        },
        secure: {
            get: `${main}secure`,
            test: `${main}secure-test`,
        },
        user: {
            set: `${main}set-user`,
            check: `${main}check-user`,
            getQr: `${main}get-user-qr-code`,
            setQr: `${main}set-user-by-qr-code`,
        },
        data: {
            version: `${main}get-version`,
            config: `${main}get-config`,
            questions: `${main}get-questions`,
            images: `${main}get-images`,
        },
        statistics: {
            memoAnswers: `${main}memo-answers`,
            getAnswers: `${main}get-answers`,
            getLastLogTimestamp: `${main}get-last-log-timestamp`,
            memoLogs: `${main}memo-logs`,
        },
    }
}())
