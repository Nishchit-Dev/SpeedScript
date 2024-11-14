'use client'
import { useEffect, useState } from 'react'
import useListenTyping, { calculateTimeGap } from '../hooks/useTyping'
import clsx from 'clsx'
import useTimer from '../hooks/useTimer'
import useCalculateScore from '../hooks/useCalculateScore'
import Image from 'next/image'
import Score from '@/components/ScoreCard/Score'
import { ModalProvider } from '@/components/ui/animated-modal'
import useGenerateTypingText from '../hooks/useGenerateTypingText'
import { addNewScore } from '@/lib/actions/score.actions'
import { currentUser } from '@clerk/nextjs/server'
import { useUser } from '@clerk/nextjs'

import useAddNewScore from '../hooks/useAddNewScore'
import { useCookiesScore } from '../hooks/cookies/useCookies'
import { useTimexWpm } from '../hooks/useTimeXWpm'
import TimexWpm from '@/components/graph/timexwpmGraph'
import ShowGraph from '@/components/graph/showGraph'
import useCursor from '../hooks/curosrAnimationHook/useCursorAnimation'
import { RefreshCcw } from 'lucide-react'

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
        withSymbols: true,
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
    const [autoSpacing, setAutoSpacing] = useState(false)
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

    useEffect(() => {
        if (isTyping && cursor < 1 && timerOption >= timer) {
            startTimer()
        }

        if (
            (timerOption <= timer && isTyping)
        ) {
            stopTimer()
            setIsTyping(!isTyping)
            setGameOver(true)
        }
    }, [timer, cursor, isTyping])

    const cursorPosition = useCursor({ cursor })
    const [style, setStyle] = useState(false)

    useCookiesScore({ gameover: gameOver, wpm: score.wpm, data: charTypedInfo })
    const { timexwpm } = useTimexWpm({ timer: timer, wpm: score.wpm })
    return (
        <>
            {!style ? (
                <div
                    className={clsx(
                        { 'absolute w-full ': !gameOver },
                        {
                            invisible: gameOver,
                        }
                    )}
                >
                    <div
                        className={
                            'relative w-1 h-8 transition duration-300 bg-yellow-500 '
                        }
                        style={{
                            transform: `translate(${cursorPosition.x - 2}px, ${
                                cursorPosition.y - 99
                            }px)`,
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
                    <div className="flex flex-row text-sm">
                        <div
                            className="m-2 text-white/60 hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer"
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
                                {
                                    'text-green-300 hover:text-green-500':
                                        buttons.style,
                                },
                                {
                                    'm-2 text-white/60 hover:text-white/80  transition duration-500 ease-out rounded-sm px-2 cursor-pointer':
                                        true,
                                }
                            )}
                            onClick={() => {
                                setButtons((prev) => {
                                    return { ...prev, style: !prev.style }
                                })
                            }}
                        >
                            <p>Style</p>
                        </div>
                        <div
                            className="m-2 text-white/60 hover:text-white/80 transition duration-500 ease-out rounded-sm px-2 cursor-pointer"
                            onClick={() => {
                                setButtons((prev) => {
                                    return {
                                        ...prev,
                                        autoCorrect: !prev.autoCorrect,
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
                                { 'text-green-400': timerOption == 120 },
                                {
                                    'text-white/60': timerOption != 120,
                                }
                            )}
                            onClick={() => {
                                setTimerOption(120)
                            }}
                        >
                            <p>120s</p>
                        </div>
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

                {buttons.autoCorrect ? (
                    <>
                        <div
                            className={clsx(
                                'overflow-hidden transition-all duration-700 ease-in-out',
                                {
                                    'max-h-0 opacity-0 scale-0 ':
                                        buttons.autoCorrect,
                                    'max-h-[500px] opacity-100 scale-100':
                                        !buttons.autoCorrect,
                                }
                            )}
                        >
                            <TimexWpm data={timexwpm} />
                        </div>

                        <div
                            className={clsx(
                                'overflow-hidden transition-all duration-700 ease-in-out',
                                {
                                    'max-h-0 opacity-0 scale-0 ':
                                        buttons.autoCorrect,
                                    'max-h-[500px] opacity-100 scale-100':
                                        !buttons.autoCorrect,
                                }
                            )}
                        >
                            <ShowGraph data={charTypedInfo} />
                        </div>
                    </>
                ) : (
                    <></>
                )}

                <div>
                    <div className="text-3xl font-jetBrainsMono font-bold">
                        <div className="flex flex-col justify-center items-center gap-3 ">
                            <div className="flex flex-row gap-10 text-black/60">
                                <p>{'Wpm: ' + score.wpm}</p>
                                <p>{'Time: ' + timer}</p>
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
                        { 'left-[45%] ': buttons.style },

                        'max-w-full relative overflow-hidden w-full'
                    )}
                >
                    {buttons.style ? (
                        <div className="flex flex-row gap-10">
                            <div className="z-20 absolute ">
                                <Image
                                    src={'/blured-sides/fade-text-left.png'}
                                    alt="typing"
                                    height={0}
                                    width={100}
                                    className="w-[100px] z-20"
                                />
                            </div>

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
                                                            ) &&
                                                            !preventIncorrect,
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
                            <div
                                // style={{ transform: `translateX(-${progress}%)` }}
                                className={`flex flex-1 flex-wrap w-1/2 font-jetBrainsMono justify-center items-center md:text-2xl lg:text-3xl relative left-[25%] transition duration-2000 ease-out `}
                            >
                                {characterArray.length > 0 ? (
                                    characterArray.map((character, index) => {
                                        return (
                                            <p
                                                key={index}
                                                className={clsx(
                                                    {
                                                        'text-gray-400':
                                                            index > charIndex,
                                                    },
                                                    {
                                                        'text-black':
                                                            index < charIndex ||
                                                            !incorrectChar.includes(
                                                                index
                                                            ),
                                                    },
                                                    {
                                                        'text-red-500':
                                                            index < charIndex &&
                                                            incorrectChar.includes(
                                                                index
                                                            ) &&
                                                            !preventIncorrect,
                                                    },

                                                    {
                                                        'font-bold':
                                                            index == charIndex,
                                                        'text-3xl':
                                                            index == charIndex,
                                                        'text-green-500 cursorIsHere':
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
                                            Generating
                                        </h1>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* {gameOver ? (
                    <ModalProvider>
                        <Score
                            trigger={gameOver}
                            data={charTypedInfo}
                            _wpm={score.wpm}
                            timexwpm={timexwpm}
                        />
                    </ModalProvider>
                ) : (
                    <></>
                )} */}
                <>
                    {gameOver ? (
                        <div className="flex flex-row gap-2 items-center mt-8 cursor-pointer">
                            <RefreshCcw
                                className="text-gray-400 hover:text-gray-500 transition-all duration-300"
                                onClick={() => {
                                    location.reload()
                                }}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            </div>
        </>
    )
}
