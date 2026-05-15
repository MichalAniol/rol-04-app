namespace engine {
    export namespace select {
        export const selectByTemperature = (array: TensorDataT[], temperature: number, num: number) => {
            if (temperature < 0) {
                throw new Error("Temperature musi być w zakresie od 0 do 1.")
            }

            if (temperature > 1) temperature = 1

            if (num > array.length) {
                throw new Error("Nie można wybrać więcej elementów niż zawiera tablica.")
            }

            // Parametr krzywizny rozkładu – im niższa temperatura, tym bardziej skupione na początku
            const baseSharpness = 50 // może być też np. 20, jeśli chcesz mocniejsze skupienie
            const k = baseSharpness * (1 - temperature)

            // Oblicz wagi wg odwróconego logarytmu
            const weights = array.map((_, i) => 1 / Math.log(k * i + 2))

            // Losowanie bez powtórzeń wg wag
            const result: TensorDataT[] = []
            const usedIndices = new Set<number>()

            while (result.length < num) {
                // Suma wag nieużytych
                const totalWeight = weights.reduce((sum, w, i) => usedIndices.has(i) ? sum : sum + w, 0)
                let rand = Math.random() * totalWeight * temperature

                for (let i = 0; i < array.length; i++) {
                    if (usedIndices.has(i)) continue
                    rand -= weights[i]
                    if (rand <= 0) {
                        result.push(array[i])
                        usedIndices.add(i)
                        break
                    }
                }
            }

            return result
        }
    }
}