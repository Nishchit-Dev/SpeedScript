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
}

const useTypedContent = ({
    gameOver,
    gameData,
}: {
    gameOver?: boolean
    gameData: gameData
}) => {
    const [charTypedInfomatics, setCharTypedInfomatics] = useState<any>([
        { char: '', index: 0, correct: true },
    ])
    const [wpm, setWpm] = useState(0)

    useEffect(() => {
        if (gameOver) {
            const wordsTyped = countWords(charTypedInfomatics)
            console.log('wordsTyped', wordsTyped)
            setWpm(wordsTyped / gameData.time)

            // switch (gameData.time) {
            //     case 10:
            //         setWpm(wordsTyped / gameData.time) // Convert seconds to minutes

            //         break
            //     case 30:
            //         setWpm(wordsTyped / gameData.time)
            //         break

            //     case 60:
            //         setWpm(wordsTyped / gameData.time)
            //         break

            //     case 120:
            //         setWpm(wordsTyped / gameData.time)
            //         break
            // }
        }
    }, [gameOver])

    useEffect(() => {
        console.log('wpm: ', wpm*100)
    }, [wpm])

    return { charTypedInfomatics, setCharTypedInfomatics }
}

export default useTypedContent
