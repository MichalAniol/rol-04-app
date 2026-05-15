type GetQuestionResponseT = {
    id: string,
    version: string,
    question: string,
    answer: string,
    falseAnswers: [string, string, string],
    firstUsed: string,
    used?: string[]
  }

namespace queries {
    export namespace data {
        export const getAllQuestions = async (): Promise<GetQuestionResponseT[]> => {
            const result = await api.get<GetQuestionResponseT[]>(
                url.data.questions,
                { withCredentials: true, }
            )

            return result.data
        }
    }
}