'use client'
import { useEffect, useState } from 'react'
import useListenTyping from '../hooks/useTypingRoom'
import clsx from 'clsx'
import useTimer from '../hooks/useTimer'
import useCalculateScore from '../hooks/useCalculateScore'
import Score from '@/components/ScoreCard/Score'

import { useCookiesScore } from '../hooks/cookies/useCookies'
import { useTimexWpm } from '../hooks/useTimeXWpm'
import TimexWpmRoom from '@/components/graph/timexwpmGraphRoom'
import ShowGraph from '@/components/graph/showGraph'
import useCursor from '../hooks/curosrAnimationHook/useCursorAnimation'
import { RefreshCcw } from 'lucide-react'
import useUserLocal from '../hooks/cookies/useGuest'
import useGhostCursor from '../hooks/curosrAnimationHook/useGhostCursor'
import useSocket from '../hooks/websockethooks/useSockets'
import useRandomColor from '../hooks/useRandomColor'
import RankUsers, { RankingStage } from './_ranks/rankUsers'
import OnBoarding from './onBoarding'
import { useUser } from '@clerk/nextjs'

export default function Typing() {
    const { isSignedIn, user } = useUser()
    const [charTyped, setCharTyped] = useState([])
    const [typingSentence, setTypingSentence] = useState('')

    const [characterArray, setCharacterArray] = useState<string[]>([])
    const [buttons, setButtons] = useState({
        style: false,
        autoCorrect: true,
        withSymbols: false,
        ghost: false,
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
    const [timerOption, setTimerOption] = useState(30)
    const { progress, incorrectChar, cursor, charTypedInfo } = useListenTyping(
        characterArray,
        charTyped,
        setCharTyped,
        preventIncorrect,
        isTyping,
        setIsTyping,
        gameOver,
        startTimer
    )

    const score = useCalculateScore(
        isTyping,
        timer,
        cursor,
        incorrectChar.length,
        gameOver
    )

    const ghostCursorPosition = useGhostCursor({
        gameOver,
        ghost: buttons.ghost,
    })
    const [multiplier, setMultiplier] = useState(1)
    const numberOfCharacters = 300
    useEffect(() => {
        console.log(charIndex < numberOfCharacters * multiplier)
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
            sendTimeout()
        }
    }, [timer, cursor, isTyping])
    useEffect(() => {
        if (
            charIndex == characterArray.length - 1 &&
            characterArray.length > 0 &&
            gameState == 'in_progress'
        ) {
            stopTimer()
            setIsTyping(!isTyping)
            setGameState('finished')

            setGameOver(true)
        }
    }, [charIndex])

    const cursorPosition = useCursor({ cursor })
    const [style, setStyle] = useState(false)

    // useCookiesScore({ gameover: gameOver, wpm: score.wpm, data: charTypedInfo })
    const { timexwpm } = useTimexWpm({ timer: timer, wpm: score.wpm })

    const {
        roomData,
        toggleReady,
        playerControls,
        countDown,
        gameState,
        sendResults,
        finalState,
        setGameState,
        sendTimeout,
    } = useSocket({
        cursor,
        totalCharacter: typingSentence.length,
        setIsTyping,
        userStats: timexwpm,
        wpm: score.wpm,
    })

    useEffect(() => {
        setTypingSentence(roomData.roomText)
    }, [roomData.roomText])

    useEffect(() => {
        console.log(gameState)
        if (gameState == 'finished') {
            sendResults(timexwpm, score.wpm)
        }
    }, [gameState])

    const charactersToShow = 200 // Number of characters to display at a time
    const startIndex =
        Math.floor(charIndex / charactersToShow) * charactersToShow // Calculate the starting index based on the cursor position

    const getPosition = (index?: number) => {
        const element = document.querySelector(`.character${index}`)
        const rct = element?.getBoundingClientRect()

        const x = rct?.left ?? 0
        const y = rct?.top ?? 0
        const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        return { x: x + scrollX, y: y + scrollY }
    }

    const { colors } = useRandomColor()

    return (
        <>
            {user?.username || isSignedIn || true ? (
                <>
                    {!style ? (
                        <div
                            className={clsx(
                                {
                                    'relative w-full justify-center items-center':
                                        !gameOver,
                                },
                                {
                                    invisible: gameOver,
                                }
                            )}
                        >
                            <div
                                className={
                                    'absolute w-1 h-8 transition duration-300 bg-yellow-500 sm:h-2 md:h-7 lg:h-8'
                                }
                                style={{
                                    transform: `translate(${
                                        cursorPosition.x - 2
                                    }px, ${cursorPosition.y - 99}px)`,
                                }}
                            ></div>
                            {Object.entries(roomData.roomInfo).map(
                                ([player, state], index) => {
                                    const typedState = state as {
                                        currentPosition: number
                                        x: number
                                        y: number
                                    }
                                    if (player == roomData.username) return
                                    return (
                                        <div
                                            key={index}
                                            className={clsx(
                                                `absolute w-1 h-8 align-middle transition duration-200 ${colors[index]} opacity-45 ease-out  sm:h-5 md:h-5 lg:h-8`,
                                                {
                                                    'invisible ':
                                                        typedState.currentPosition <=
                                                            numberOfCharacters *
                                                                (multiplier -
                                                                    1) ||
                                                        typedState.currentPosition >=
                                                            numberOfCharacters *
                                                                multiplier,
                                                }
                                            )}
                                            style={{
                                                transform: `translate(${
                                                    Number(
                                                        getPosition(
                                                            typedState.currentPosition
                                                        )?.x ?? 0
                                                    ) - 2
                                                }px, ${
                                                    Number(
                                                        getPosition(
                                                            typedState.currentPosition
                                                        )?.y ?? 0
                                                    ) - 99
                                                }px)`,
                                            }}
                                        ></div>
                                    )
                                }
                            )}
                            <div
                                className={clsx(
                                    'absolute w-1 h-8 transition duration-200 bg-gray-400 ease-out ',
                                    {
                                        'invisible ':
                                            ghostCursorPosition.ghostCursorIndex <=
                                                numberOfCharacters *
                                                    (multiplier - 1) ||
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
                        {gameOver ? (
                            <></>
                        ) : (
                            <div
                                className={clsx(
                                    {
                                        'flex flex-row invisible transition duration-500 ease-out':
                                            isTyping,
                                    },
                                    {
                                        'flex justify-center  flex-row relative mb-20 bg-gray-600 font-jetBrainsMono rounded-lg':
                                            true,
                                    }
                                )}
                            >
                                <div>
                                    <div className="flex flex-row">
                                        {Object.entries(roomData.roomInfo).map(
                                            ([player, state], index) => {
                                                const typedValues = state as {
                                                    currentPosition: string
                                                    isReady: boolean
                                                }
                                                return (
                                                    <div
                                                        className="p-2 bg-white"
                                                        key={player}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                ` p-2 justify-center items-center flex cursor-pointer gap-1`,
                                                                {
                                                                    'opacity-100':
                                                                        typedValues.isReady,
                                                                },
                                                                {
                                                                    'opacity-50':
                                                                        !typedValues.isReady,
                                                                }
                                                            )}
                                                        >
                                                            <p>{player}</p>
                                                            <span
                                                                className={clsx(
                                                                    `${colors[index]} w-2 h-7 rounded-full flex flex-1`
                                                                )}
                                                            ></span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>

                                    <div
                                        className={clsx(
                                            ' p-2 justify-center items-center flex cursor-pointer',
                                            {
                                                'bg-green-500': playerControls,
                                            },
                                            {
                                                'bg-red-500': !playerControls,
                                            }
                                        )}
                                        onClick={toggleReady}
                                    >
                                        <div className="">
                                            <p
                                                className={clsx({
                                                    hidden: countDown === 0,
                                                    'flex transition duration-500 ease-out text-2xl font-extrabold mr-5':
                                                        countDown !== 0,
                                                })}
                                            >
                                                {countDown}
                                            </p>
                                        </div>
                                        Ready
                                    </div>
                                </div>
                            </div>
                        )}
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
                        {gameOver ? <RankingStage data={finalState} /> : <></>}

                        {gameOver ? (
                            <div className="flex flex-1 flex-row mt-20">
                                <div>
                                    <Score
                                        data={charTypedInfo}
                                        _wpm={score.wpm}
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
                                        <TimexWpmRoom
                                            data={finalState}
                                            timer={timer}
                                        />
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
                                <div>
                                    <RankUsers data={finalState} />
                                </div>
                            </div>
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
                                    'max-h-[500px] opacity-100 scale-100':
                                        !gameOver,
                                },
                                {
                                    hidden: !isTyping,
                                }
                            )}
                        >
                            <div className="text-3xl font-jetBrainsMono font-bold">
                                <div className="flex flex-col justify-center items-center gap-3 ">
                                    <div className="flex flex-row gap-10 text-black/60">
                                        <p>{'Wpm: ' + score.wpm}</p>
                                        <p>{'Time: ' + timer}</p>
                                    </div>
                                    <div>
                                        {characterArray.length > 0 ? (
                                            <p className="mb-3">
                                                {characterArray[cursor] ==
                                                    ' ' ||
                                                characterArray[cursor] ==
                                                    '\u2000'
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
                                    'max-h-[500px] opacity-100 scale-100':
                                        !gameOver,
                                }
                            )}
                        >
                            <div
                                // style={{ transform: `translateX(-${progress}%)` }}
                                className={clsx(
                                    `flex flex-1   flex-wrap w-1/2 font-jetBrainsMono justify-center items-center md:text-2xl lg:text-3xl relative left-[25%] transition duration-2000 ease-out `,
                                    {
                                        hidden: !isTyping,
                                    }
                                )}
                            >
                                {characterArray.length > 0 ? (
                                    characterArray.map((character, index) => {
                                        if (
                                            index >=
                                                numberOfCharacters *
                                                    (multiplier - 1) &&
                                            index <=
                                                numberOfCharacters * multiplier
                                        )
                                            return (
                                                <p
                                                    key={index}
                                                    className={clsx(
                                                        `character${index}  `,
                                                        {
                                                            'text-gray-400':
                                                                index >
                                                                charIndex,
                                                        },
                                                        {
                                                            'text-black':
                                                                index <
                                                                    charIndex ||
                                                                !incorrectChar.includes(
                                                                    index
                                                                ),
                                                        },
                                                        {
                                                            'text-red-500':
                                                                index <
                                                                    charIndex &&
                                                                incorrectChar.includes(
                                                                    index
                                                                ) &&
                                                                !preventIncorrect,
                                                        },

                                                        {
                                                            'font-bold':
                                                                index ==
                                                                charIndex,
                                                            'text-3xl':
                                                                index ==
                                                                charIndex,
                                                            'text-green-500 cursorIsHere':
                                                                index ==
                                                                charIndex,
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
                        </div>
                    </div>
                </>
            ) : (
                <OnBoarding />
            )}
        </>
    )
}
