'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import Image from 'next/image'
import Score from '@/components/ScoreCard/Score'
import TimexWpm from '@/components/graph/timexwpmGraph'
import ShowGraph from '@/components/graph/showGraph'
import UserRankingSystem from './_ranks/userRanks'
import useListenTyping from './hooks/useTyping'
import useTimer from './hooks/useTimer'
import useGenerateTypingText from './hooks/useGenerateTypingText'
import { useCookiesScore } from './hooks/cookies/useCookies'
import { useTimexWpm } from './hooks/useTimeXWpm'
import useCursor from './hooks/curosrAnimationHook/useCursorAnimation'
import { RefreshCcw } from 'lucide-react'
import useUserLocal from './hooks/cookies/useGuest'
import useGhostCursor from './hooks/curosrAnimationHook/useGhostCursor'
import { addNewScore } from '@/lib/actions/score.actions'
import useAddNewScore from './hooks/useAddNewScore'
import { useUser } from '@clerk/nextjs'
import ReloadButton from '@/components/reload/reload'
import useLivePlayer from './hooks/websockethooks/useLivePlayers'
import LobbyText from './multiplayer/component/LobbyText'

const TypingText =
    'The quick brown fox jumps over the lazy dog and enjoys the warm sunshine on a bright afternoon.'

const onlyAlphabetsAndSpace = [...TypingText].filter((char) =>
    /[a-zA-Z\u2000\s]/.test(char)
)

export default function Typing() {
    const [charTyped, setCharTyped] = useState([])
    const typingSentence = useGenerateTypingText().typingSuggestion
    const [characterArray, setCharacterArray] = useState<string[]>([])
    const [buttons, setButtons] = useState({
        style: false,
        autoCorrect: true,
        withSymbols: false,
        ghost: true,
    })
    useEffect(() => {
        let characterArray = typingSentence
            .split('')
            .map((element: string) =>
                element === ' ' ? `\u2000` : element.toLowerCase()
            )
        const onlyAlphabetsAndSpace = !buttons.withSymbols
            ? [...characterArray].filter((char) =>
                  /[a-zA-Z\u2000\s]/.test(char)
              )
            : characterArray

        setCharacterArray(onlyAlphabetsAndSpace)
    }, [typingSentence, buttons.withSymbols])

    const charIndex = charTyped.length
    const [preventIncorrect, setPreventIncorrect] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const { timer, startTimer, stopTimer } = useTimer()
    const [timerOption, setTimerOption] = useState(10)
    const {
        progress,
        incorrectChar,
        cursor,
        charTypedInfo,
        CapsLock,
        wpm: _wpm,
    } = useListenTyping(
        characterArray,
        charTyped,
        setCharTyped,
        buttons.autoCorrect,
        isTyping,
        setIsTyping,
        gameOver,
        startTimer,
        { time: timer, totalCharcter: characterArray.length, timer: timer }
    )

    const ghostCursorPosition = useGhostCursor({
        gameOver,
        ghost: buttons.ghost,
    })
    const { user } = useUser()

    useAddNewScore(gameOver, _wpm, user ?? null,timerOption)

    const [multiplier, setMultiplier] = useState(1)
    const numberOfCharacters = 300
    useEffect(() => {
        if (charIndex > numberOfCharacters * multiplier) {
            setMultiplier((prev) => prev + 1)
        }
    }, [charIndex])

    useEffect(() => {
        if (buttons.ghost) {
            if (isTyping) {
                ghostCursorPosition.startGhostCursor()
            } else {
                ghostCursorPosition.stopTimer()
            }
        }
    }, [isTyping])
    useEffect(() => {
        if (isTyping && cursor < 1 && timerOption >= timer) {
            startTimer()
        }
        if (timerOption <= timer && isTyping) {
            stopTimer()
            setIsTyping(!isTyping)
            setGameOver(true)
        }
    }, [timer, cursor, isTyping])
    useEffect(() => {
        if (
            charIndex == characterArray.length - 1 &&
            characterArray.length > 0
        ) {
            stopTimer()
            setIsTyping(!isTyping)
            setGameOver(true)
        }
    }, [charIndex])

    const cursorPosition = useCursor({ cursor })

    const [style, setStyle] = useState(false)

    useCookiesScore({ gameover: gameOver, wpm: _wpm, data: charTypedInfo })
    const { timexwpm } = useTimexWpm({ timer: timer, wpm: _wpm })

    const charactersToShow = 200 // Number of characters to display at a time

    const startIndex =
        Math.floor(charIndex / charactersToShow) * charactersToShow // Calculate the starting index based on the cursor position

    useEffect(() => {
        const splitIntoWordSpaceSegments = (characterArray: string[]) => {
            const segments: Array<{
                type: 'word' | 'space'
                chars: string[]
                indices: number[]
            }> = []
            let currentSegment: string[] = []
            let currentIndices: number[] = []

            characterArray.forEach((char, index) => {
                if (char === '\u2000') {
                    if (currentSegment.length > 0) {
                        segments.push({
                            type: 'word',
                            chars: currentSegment,
                            indices: currentIndices,
                        })
                        currentSegment = []
                        currentIndices = []
                    }
                    segments.push({
                        type: 'space',
                        chars: [char],
                        indices: [index],
                    })
                } else {
                    currentSegment.push(char)
                    currentIndices.push(index)
                }
            })

            if (currentSegment.length > 0) {
                segments.push({
                    type: 'word',
                    chars: currentSegment,
                    indices: currentIndices,
                })
            }

            return segments
        }
        const segments = splitIntoWordSpaceSegments(characterArray)

        const findClosestSpace = (
            characterArray: string[],
            targetIndex: number
        ) => {
            let closestSpaceIndex = targetIndex
            let minDistance = Infinity

            characterArray.forEach((char, index) => {
                if (char === '\u2000') {
                    const distance = Math.abs(index - targetIndex)
                    if (distance < minDistance) {
                        closestSpaceIndex = index
                        minDistance = distance
                    }
                }
            })
        }

        findClosestSpace(characterArray, charactersToShow)
    }, [characterArray])

    // Inside the component, generate the segments
    const [newText, setText] = useState<string[][]>([])

    useMemo(() => {
        const segments: string[][] = []
        let currentSegment: string[] = []
        let spaceCount = 0

        characterArray.forEach((char, index) => {
            currentSegment.push(char)
            if (char === '\u2000') {
                spaceCount++
            }

            if (window.innerWidth >= 1200 && spaceCount === 14) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            } else if (window.innerWidth >= 1000 && spaceCount === 10) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            } else if (
                window.innerWidth >= 768 &&
                window.innerWidth < 1200 &&
                spaceCount === 10
            ) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            } else if (window.innerWidth < 768 && spaceCount === 6) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            }
        })

        if (currentSegment.length > 0) {
            segments.push([...currentSegment])
        }

        setText(segments)
    }, [characterArray])

    return (
        <>
            {!style ? (
                <div
                    className={clsx(
                        { 'relative w-full ': !gameOver },
                        {
                            invisible: gameOver,
                        }
                    )}
                >
                    <div
                        className={
                            'absolute w-1 h-8 transition duration-300 bg-yellow-500 '
                        }
                        style={{
                            transform: `translate(${cursorPosition.x - 2}px, ${
                                cursorPosition.y - 99
                            }px)`,
                        }}
                    ></div>

                    <div
                        className={clsx(
                            'absolute w-1 h-8 transition duration-200 bg-gray-400 ease-out ',
                            {
                                'invisible ':
                                    ghostCursorPosition.ghostCursorIndex <=
                                        numberOfCharacters * (multiplier - 1) ||
                                    ghostCursorPosition.ghostCursorIndex >=
                                        numberOfCharacters * multiplier,
                            }
                        )}
                        style={{
                            transform: `translate(${
                                ghostCursorPosition.x - 2
                            }px, ${ghostCursorPosition.y - 99}px)`,
                        }}
                    ></div>
                </div>
            ) : (
                <></>
            )}

            <div className="flex flex-1 flex-col justify-center items-center w-screen overflow-hidden min-h-[70vh] bg-[#E1E1E3]">
                <div
                    className={clsx(
                        {
                            'invisible transition duration-500 ease-out':
                                isTyping,
                        },
                        {
                            ' relative mb-20 bg-gray-600 font-jetBrainsMono rounded-lg':
                                true,
                        }
                    )}
                >
                    {/* here is the buttons for the modification of game rules */}
                    <div className="flex flex-row text-sm">
                        {!gameOver ? (
                            <>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80  transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        {
                                            'text-green-400':
                                                buttons.withSymbols,
                                        },
                                        {
                                            'text-white/60':
                                                !buttons.withSymbols,
                                        }
                                    )}
                                    onClick={() => {
                                        setButtons((prev) => {
                                            return {
                                                ...prev,
                                                withSymbols: !prev.withSymbols,
                                            }
                                        })
                                    }}
                                >
                                    <p>@ puncutuation</p>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80  transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        { 'text-green-400': buttons.style },
                                        {
                                            'text-white/60': !buttons.style,
                                        }
                                    )}
                                    onClick={() => {
                                        setButtons((prev) => {
                                            return {
                                                ...prev,
                                                style: !prev.style,
                                            }
                                        })
                                    }}
                                >
                                    <p>Style</p>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80  transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        { 'text-green-400': buttons.ghost },
                                        {
                                            'text-white/60': !buttons.ghost,
                                        }
                                    )}
                                    onClick={() => {
                                        setButtons((prev) => {
                                            return {
                                                ...prev,
                                                ghost: !prev.ghost,
                                            }
                                        })
                                    }}
                                >
                                    <p>Ghost Cursor</p>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        {
                                            'text-green-400':
                                                !buttons.autoCorrect,
                                        },
                                        {
                                            'text-white/60':
                                                buttons.autoCorrect,
                                        }
                                    )}
                                    onClick={() => {
                                        setButtons((prev) => {
                                            return {
                                                ...prev,
                                                autoCorrect:
                                                    !buttons.autoCorrect,
                                            }
                                        })
                                    }}
                                >
                                    <p>AutoCorrect</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="w-1 h-[60%] bg-gray-400 rounded-full"></div>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        { 'text-green-400': timerOption == 10 },
                                        {
                                            'text-white/60': timerOption != 10,
                                        }
                                    )}
                                    onClick={() => {
                                        setTimerOption(10)
                                    }}
                                >
                                    <p>10s</p>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        { 'text-green-400': timerOption == 30 },
                                        {
                                            'text-white/60': timerOption != 30,
                                        }
                                    )}
                                    onClick={() => {
                                        setTimerOption(30)
                                    }}
                                >
                                    <p>30s</p>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2 hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        { 'text-green-400': timerOption == 60 },
                                        {
                                            'text-white/60': timerOption != 60,
                                        }
                                    )}
                                    onClick={() => {
                                        setTimerOption(60)
                                    }}
                                >
                                    <p>60s</p>
                                </div>
                                <div
                                    className={clsx(
                                        'm-2  hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                                        {
                                            'text-green-400':
                                                timerOption == 120,
                                        },
                                        {
                                            'text-white/60': timerOption != 120,
                                        }
                                    )}
                                    onClick={() => {
                                        setTimerOption(120)
                                    }}
                                >
                                    <p>120s</p>
                                </div>{' '}
                            </>
                        ) : (
                            <></>
                        )}
                        <ReloadButton gameOver={gameOver} />
                    </div>
                </div>
                <div className="flex flex-row flex-wrap justify-start items-center gap-5">
                    {/* <div className="flex flex-row justify-start items-center bg-blue-600 px-5 py-2 rounded-full hover:bg-purple-700 transition duration-1000 ease-out ">
                    <button
                        onClick={() => setPreventIncorrect(!preventIncorrect)}
                    >
                        {preventIncorrect
                            ? 'Enable prevent incorrect'
                            : 'Disable Prevent Incorret'}
                    </button>
                </div> */}
                </div>

                {gameOver ? (
                    <>
                        <div>
                            <UserRankingSystem wpm={_wpm} />
                        </div>

                        <div className="flex flex-1 flex-row">
                            <div>
                                <Score
                                    data={charTypedInfo}
                                    _wpm={_wpm}
                                    timexwpm={timexwpm}
                                />
                            </div>
                            <div>
                                <div
                                    className={clsx(
                                        'overflow-hidden transition-all duration-700 ease-in-out',
                                        {
                                            'max-h-0 opacity-0 scale-0 ':
                                                !gameOver,
                                        },
                                        {
                                            'max-h-[500px] opacity-100 scale-100':
                                                gameOver,
                                        }
                                    )}
                                >
                                    <TimexWpm data={timexwpm} timer={timer} />
                                </div>

                                <div
                                    className={clsx(
                                        'overflow-hidden transition-all duration-700 ease-in-out',
                                        {
                                            'max-h-0 opacity-0 scale-0 ':
                                                !gameOver,
                                        },
                                        {
                                            'max-h-[500px] opacity-100 scale-100':
                                                gameOver,
                                        }
                                    )}
                                >
                                    <ShowGraph data={charTypedInfo} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}

                <div
                    className={clsx(
                        'transition duration-500',
                        {
                            'max-h-0 opacity-0 scale-0 ': gameOver,
                        },
                        {
                            'max-h-[500px] opacity-100 scale-100': !gameOver,
                        }
                    )}
                >
                    <div className="text-3xl font-jetBrainsMono font-bold">
                        <div className="flex flex-col justify-center items-center gap-3 ">
                            <div className="flex flex-row gap-10 text-black/60">
                                <p>{'Wpm: ' + _wpm}</p>
                                <p>{'Time: ' + timer}</p>
                            </div>
                            <div
                                className={clsx(
                                    {
                                        'text-green-600': CapsLock,
                                    },
                                    { invisible: !CapsLock }
                                )}
                            >
                                <p>Capslock</p>
                            </div>
                            <div>
                                {characterArray.length > 0 ? (
                                    <p className="mb-3">
                                        {characterArray[cursor] == ' ' ||
                                        characterArray[cursor] == '\u2000'
                                            ? 'space'
                                            : characterArray[cursor]}
                                    </p>
                                ) : (
                                    <p className="mb-3 invisible">a</p>
                                )}
                            </div>
                        </div>

                        {/* <p>{'Accuracy: ' + score.accuracy}</p> */}
                        {/* <p>{isTyping ? 'Typing' : 'Not Typing'}</p> */}
                    </div>
                </div>

                <div
                    className={clsx(
                        'max-w-full relative overflow-hidden w-full transition-all duration-700 ease-in-out',
                        { 'left-[45%] ': buttons.style },
                        {
                            'max-h-0 opacity-0 scale-0 ': gameOver,
                        },
                        {
                            'max-h-[500px] opacity-100 scale-100': !gameOver,
                        }
                    )}
                >
                    {buttons.style ? (
                        <div className="flex flex-row gap-10">
                            <div className="z-20 absolute w-[100px] h-[50px] bg-gradient-to-r from-[#E1E1E3] to-transparent"></div>

                            <div
                                style={{
                                    transform: `translateX(-${progress}%)`,
                                }}
                                className={`ml-20 flex flex-row font-jetBrainsMono justify-start items-center md:text-2xl lg:text-3xl relative transition duration-1000 ease-out `}
                            >
                                {characterArray.length > 0 ? (
                                    characterArray.map((character, index) => {
                                        return (
                                            <p
                                                key={index}
                                                className={clsx(
                                                    {
                                                        'text-gray-500 ':
                                                            index > charIndex,
                                                    },
                                                    {
                                                        'text-black ':
                                                            index < charIndex ||
                                                            !incorrectChar.includes(
                                                                index
                                                            ),
                                                    },
                                                    {
                                                        'text-red-500 ':
                                                            index < charIndex &&
                                                            incorrectChar.includes(
                                                                index
                                                            ),
                                                    },

                                                    {
                                                        'font-bold ':
                                                            index == charIndex,
                                                        'text-3xl ':
                                                            index == charIndex,
                                                        'text-green-400 ':
                                                            index == charIndex,
                                                    }
                                                )}
                                            >
                                                {character}
                                            </p>
                                        )
                                    })
                                ) : (
                                    <div className="">
                                        <h1 className="moving-text ">
                                            generating
                                        </h1>
                                    </div>
                                )}
                            </div>
                            <div className="z-20 absolute right-0">
                                <Image
                                    src={'/blured-sides/fade-text-right.png'}
                                    alt="typing"
                                    height={0}
                                    width={0}
                                    className="w-[100px] h-[100px] z-20"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <LobbyText
                                characterArray={characterArray}
                                charactersToShow={charactersToShow}
                                charIndex={charIndex}
                                numberOfCharacters={numberOfCharacters}
                                multiplier={multiplier}
                                incorrectChar={incorrectChar}
                                isTyping={true}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
