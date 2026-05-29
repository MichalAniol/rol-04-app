export const toString = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject

        reader.readAsDataURL(blob)
    })

export const toBlob = async (value: string) => {
    const response = await fetch(value)
    return await response.blob()
}