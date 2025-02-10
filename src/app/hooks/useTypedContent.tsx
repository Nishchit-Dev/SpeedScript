import { useEffect, useState } from 'react'

const countWords = (
    charTypedInfomatics: { char: string; index: number; correct: boolean }[]
) => {
    let correctWordCount = 0
    let currentWordCorrect = true

    for (let i = 0; i < charTypedInfomatics.length; i++) {
        if (
            charTypedInfomatics[i].char === ' ' ||
            i === charTypedInfomatics.length - 1
        ) {
            if (currentWordCorrect) {
                correctWordCount++
            }
            currentWordCorrect = true
        } else if (!charTypedInfomatics[i].correct) {
            currentWordCorrect = false
        }
    }

    return correctWordCount
}

interface gameData {
    time: number
    totalCharcter: number
    timer: number
}

const useTypedContent = ({
    gameOver,
    gameData,
}: {
    gameOver?: boolean
    gameData?: gameData
}) => {
    const [charTypedInfomatics, setCharTypedInfomatics] = useState<any>([
        { char: '', index: 0, correct: true },
    ])
    const [wpm, setWpm] = useState(0)

    useEffect(() => {
        if (gameData) {
            const wordsTyped = countWords(charTypedInfomatics)
            let calculatedWpm = wordsTyped / (gameData.time / 60)
            if (!isFinite(calculatedWpm)) {
                calculatedWpm = 0
            }
            setWpm(parseFloat(calculatedWpm.toFixed(2)))
        }
    }, [gameData?.timer, gameOver])

    return { charTypedInfomatics, setCharTypedInfomatics, wpm }
}

export default useTypedContent
