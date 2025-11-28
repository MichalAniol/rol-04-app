
namespace queries {
    export const responseCommand = {
        main: {
            ddos: 'DDoS',
            ddosId: 'DDoSid',
            csrf: 'csrf',
        },
        secure: {
            noMahakala: 'noMahakala',
            wrongMahakala: 'wrongMahakala',
            generateUserId: 'generateUserId',
            go: 'go',
            testOk: 'testOk'
        },
        user: {
            set: 'userSet',
            ok: 'userOk',
            no: 'noUser',
            noId: 'noId',
            qr: 'qr',
        }
    }

    // export let state: ResponseCommandsT = null
    type SecureCommandsKeysT = keyof typeof queries.responseCommand.secure
    type UserCommandsKeysT = keyof typeof queries.responseCommand.user

    type ResponseCommandsT = SecureCommandsKeysT | UserCommandsKeysT | null

    // type ResponseMessageT = {
    //     message: string
    //     command: ResponseCommandsT
    // }
}

