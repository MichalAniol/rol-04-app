namespace queries {
    export namespace statistics {
        export const getAnswers = async (): Promise<AnswersMemoT[]> => {

            const result = await api.get<AnswersMemoT[]>(
                url.statistics.getAnswers,
                { withCredentials: true, }
            )

            return result.data
        }
    }
}