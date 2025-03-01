import { useEffect, useState } from 'react'

import useTypedContent from './useTypedContent'

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

interface gameData {
    time: number
    totalCharcter: number
    timer: number
}
const useListenTyping = (
    generatedText: string[],
    charTyped: string[],
    setCharTyped: any,
    preventIncorrect: boolean,
    isTyping: boolean,
    setIsTyping: any,
    gameOver: boolean,
    startTimer: any,
    gameData: gameData
) => {
    const [CapsLock, setCapslock] = useState(false)
    const [text, setText] = useState<string[]>(generatedText)
    useEffect(() => {
        setText(generatedText)
    }, [generatedText])
    // pointer of the cursor: where the user is tpying now...
    const [cursor, setCursor] = useState(0)
    const [words, setWords] = useState({
        correctWords: [{ char: '', index: 0 }],
        incorrectWords: [{ char: '', index: 0 }],
    })
    const { charTypedInfomatics, setCharTypedInfomatics, wpm } =
        useTypedContent({
            gameOver,
            gameData,
        })

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
            // if (!isTyping) {
            //     return
            // }
            if (event.getModifierState('CapsLock') !== CapsLock) {
                setCapslock(event.getModifierState('CapsLock'))
            }
            if (event.key == 'Backspace') {
                if (cursor >= 0) {
                    setIncorrectTypeCharacter((prev) =>
                        prev.filter((char) => char !== cursor - 1)
                    )
                    setCursor(cursor - 1)
                    setCharTyped(charTyped.slice(0, -1))
                    setProgress(progress)
                }
                if (charTypedInfomatics.length > 0) {
                    setCharTypedInfomatics((prev: any) => prev.slice(0, -1))
                }
                if (words.correctWords.length > words.incorrectWords.length) {
                    // setWords((prev: any) => {
                    //     return {
                    //         ...prev,
                    //         correctWords: prev.correctWords.slice(0, -1),
                    //     }
                    // })
                }
                if (text[cursor] != event.key && preventIncorrect) {
                    // setWords((prev: any) => {
                    //     return {
                    //         ...prev,
                    //         incorrectWords: prev.incorrectWords.slice(0, -1),
                    //     }
                    // })
                }
            }

            // if Press Key is Space
            if (
                event.key == ' ' &&
                (text[cursor] == event.key || text[cursor] == '\u2000')
            ) {
                setCursor(cursor + 1)

                // setWords((prev: any) => {
                //     return {
                //         ...prev,
                //         correctWords: [
                //             ...prev.correctWords,
                //             { char: ' ', index: cursor },
                //         ],
                //     }
                // })
                setCharTypedInfomatics((prev: any) => {
                    return [
                        ...prev,
                        {
                            char: event.key,
                            index: cursor,
                            correct:
                                text[cursor] == event.key ||
                                text[cursor] == '\u2000',
                        },
                    ]
                })

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
                if (text[cursor] == event.key) {
                    // press correct key

                    setCursor((prev) => {
                        return prev + 1
                    })
                    // setWords((prev: any) => {
                    //     return {
                    //         ...prev,
                    //         correctWords: [
                    //             ...prev.correctWords,
                    //             { char: event.key, index: cursor },
                    //         ],
                    //     }
                    // })
                    setCharTypedInfomatics((prev: any) => {
                        return [
                            ...prev,
                            {
                                char: event.key,
                                index: cursor,
                                correct: text[cursor] == event.key,
                            },
                        ]
                    })

                    setCharTyped([...charTyped, event.key])
                    setProgress(progress)
                    setCharTypedInfo([
                        ...charTypedInfo,
                        {
                            char: event.key,
                            time: Date.now(),
                        },
                    ])
                } else if (!preventIncorrect && text[cursor] != event.key) {
                    // setWords((prev: any) => {
                    //     return {
                    //         ...prev,
                    //         incorrectWords: [
                    //             ...prev.incorrectWords,
                    //             { char: event.key, index: cursor },
                    //         ],
                    //     }
                    // })
                    setCharTypedInfomatics((prev: any) => {
                        return [
                            ...prev,
                            {
                                char: text[cursor] === ' ' ? ' ' : event.key,
                                index: cursor,
                                correct:
                                    text[cursor] == event.key
                                        ? true
                                        : text[cursor] == '\u2000'
                                        ? true
                                        : false,
                            },
                        ]
                    })

                    setIncorrectTypeCharacter((prev) => [...prev, cursor])
                    setCursor((prev) => {
                        return prev + 1
                    })
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
            }
        }
        let progress = (cursor / totalChar) * 100

        // Check if CapsLock is on
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
    }, [cursor, isTyping, gameOver, text, CapsLock])

    return {
        progress,
        incorrectChar: incorrectTypeCharacter,
        cursor,
        charTypedInfo,
        CapsLock,
        wpm,
    }
}

export default useListenTyping
