const alphabetData = {
    azSmall: 'qwertyuiopasdfghjklzxcvbnm',
    azBig: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    numbers: '1234567890',
} as const
const ALPHABET = alphabetData.numbers + alphabetData.azSmall + alphabetData.azBig

const regex = new RegExp(`^[${ALPHABET}]{21}$`)

// regx dla wpisywania user id
export const validateUserId = (value: string) => {
    const result = {
        text: '',
        correct: false
    }

    if (value.length < 21) {
        result.text = 'Za krótki min 21 znaków'
        return result
    }

    if (value.length > 21) {
        result.text = 'Za długi max 21 znaków'
        return result
    }

    if (!regex.test(value)) {
        result.text = 'String zawiera niedozwolone znaki'
        return result
    }

    result.text = 'jest OK.'
    result.correct = true

    return result
}