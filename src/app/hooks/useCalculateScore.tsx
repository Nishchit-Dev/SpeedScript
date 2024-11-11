import { useEffect, useState } from 'react'
import useAddNewScore from './useAddNewScore'

const useCalculateScore = (
    isTyping: boolean,
    time: number,
    cursor: number,
    incorrect: number,
    gameOver: boolean
) => {
    const [wpm, setWpm] = useState<any>(1)
    const [accuracy, setAccuracy] = useState<number>(1)

    useAddNewScore(gameOver, wpm)

    useEffect(() => {
        if (isTyping && !gameOver) {
            const wordsTyped = cursor / 5 // Assuming an average word length of 5 characters
            const minutes = time / 60 // Convert seconds to minutes

            // Check if minutes is greater than 0 to avoid division by zero
            const wpm = minutes > 0 ? parseFloat((wordsTyped / minutes).toFixed(2)) : 0;
            setWpm(wpm.toFixed(2))

            const accuracy = cursor > 0 ? Number((((cursor - incorrect) / cursor) * 100).toFixed(2)) : 0;
            setAccuracy(accuracy)
        }
    }, [time, cursor, isTyping])

    return { wpm, accuracy }
}

export default useCalculateScore
