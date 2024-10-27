import { useEffect, useState } from 'react'

const useCalculateScore = (
    isTyping: boolean,
    time: number,
    cursor: number,
    incorrect: number,
    gameOver: boolean
) => {
    const [wpm, setWpm] = useState<any>(1)
    const [accuracy, setAccuracy] = useState<number>(1)

    useEffect(() => {
        if (isTyping && !gameOver) {
            const wordsTyped = cursor / 5 // Assuming an average word length of 5 characters
            const minutes = time / 60 // Convert seconds to minutes
            const wpm = parseFloat((wordsTyped / minutes).toFixed(2))
            setWpm(wpm.toFixed(2))

            const accuracy = Number(
                (((cursor - incorrect) / cursor) * 100).toFixed(2)
            )
            setAccuracy(accuracy)
        }
    }, [time, cursor, isTyping])

    return { wpm, accuracy }
}

export default useCalculateScore
