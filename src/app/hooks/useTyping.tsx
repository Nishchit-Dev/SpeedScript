import { set } from 'mongoose'
import { eventNames } from 'process'
import { useEffect, useState } from 'react'

interface CharTypedInfo {
    char: string
    time: number
}

interface TimeGapInfo {
    char: string
    timeGap: number
}

export const calculateTimeGap = (
    charTypedInfo: CharTypedInfo[]
): TimeGapInfo[] => {
    if (charTypedInfo.length < 2) return []

    const timeGaps: TimeGapInfo[] = []

    for (let i = 1; i < charTypedInfo.length; i++) {
        const gap = charTypedInfo[i].time - charTypedInfo[i - 1].time
        timeGaps.push({
            char: charTypedInfo[i].char,
            timeGap: gap,
        })
    }
    return timeGaps
}

const useListenTyping = (
    generatedText: string[],
    charTyped: string[],
    setCharTyped: any,
    preventIncorrect: boolean,
    isTyping: boolean,
    setIsTyping: any,
    gameOver: boolean,
    startTimer: any
) => {
    const [text, setText] = useState<string[]>(generatedText)
    useEffect(() => {
        setText(generatedText)
    }, [generatedText])
    // pointer of the cursor: where the user is tpying now...
    const [cursor, setCursor] = useState(0)
    // total length of the text
    const totalChar = text.length
    const [progress, setProgress] = useState(0)
    // array for incorrect characters
    const [incorrectTypeCharacter, setIncorrectTypeCharacter] = useState<
        number[]
    >([])
    const [charTypedInfo, setCharTypedInfo] = useState<any>([])

    useEffect(() => {
        const handleEvent = (event: KeyboardEvent) => {
            // if Press Key is BackSpace
            if (!isTyping) {
                if (event.key.length == 1) {
                    setIsTyping(true)
                    startTimer()
                }
            }

            if (event.key == 'Backspace') {
                if (cursor >= 1) {
                    setIncorrectTypeCharacter((prev) =>
                        prev.filter((char) => char != cursor)
                    )
                    setCursor(cursor - 1)
                    setCharTyped(charTyped.slice(0, -1))
                    setProgress(progress)
                }
            }

            // if Press Key is Space
            if (
                event.key == ' ' &&
                (text[cursor] == event.key || text[cursor] == '\u2000') &&
                !preventIncorrect
            ) {
                setCursor(cursor + 1)
                setCharTyped([...charTyped, event.key])
                setProgress(progress)
                setCharTypedInfo([
                    ...charTypedInfo,
                    {
                        char: event.key,
                        time: Date.now(),
                    },
                ])

                // if the pressed key is a character
            } else if (event.key.length == 1) {
                if (text[cursor] == event.key && !preventIncorrect) {
                    // press correct key

                    setCursor(cursor + 1)
                    setCharTyped([...charTyped, event.key])
                    setProgress(progress)
                    setCharTypedInfo([
                        ...charTypedInfo,
                        {
                            char: event.key,
                            time: Date.now(),
                        },
                    ])
                } else if (preventIncorrect && text[cursor] != event.key) {
                    // press incorrect key

                    setIncorrectTypeCharacter((prev) => [...prev, cursor])
                    setCursor(cursor + 1)
                    setCharTyped((prev: any) => [...prev, event.key])
                    setProgress(progress)
                    setCharTypedInfo([
                        ...charTypedInfo,
                        {
                            char: event.key,
                            time: Date.now(),
                        },
                    ])
                }

                // pressed special key
            } else if (event.key.length > 1 && cursor > 1) {
                console.log('special key -> ', event.key)
            }
        }
        let progress = (cursor / totalChar) * 100

        if (cursor == totalChar - 1) {
            window.removeEventListener('keydown', handleEvent)
        } else {
            window.addEventListener('keydown', handleEvent)
        }

        if (gameOver) {
            window.removeEventListener('keydown', handleEvent)
        }
        // start the event lister when the components mounts

        // remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleEvent)
        }
    }, [cursor, isTyping, gameOver, text])

    return {
        progress,
        incorrectChar: incorrectTypeCharacter,
        cursor,
        charTypedInfo,
    }
}

export default useListenTyping
