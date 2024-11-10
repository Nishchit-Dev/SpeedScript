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

const TypingText =
    'The quick brown fox jumps over the lazy dog and enjoys the warm sunshine on a bright afternoon.'

const onlyAlphabetsAndSpace = [...TypingText].filter((char) =>
    /[a-zA-Z\u2000\s]/.test(char)
)

export default function Typing() {
    const [charTyped, setCharTyped] = useState([])
    const typingSentence = useGenerateTypingText().typingSuggestion
    const [characterArray, setCharacterArray] = useState<string[]>([])
    useEffect(() => {
        let characterArray = typingSentence
            .split('')
            .map((element: string) =>
                element === ' ' ? `\u2000` : element.toLowerCase()
            )
        const onlyAlphabetsAndSpace = [...characterArray].filter((char) =>
            /[a-zA-Z\u2000\s]/.test(char)
        )

        setCharacterArray(onlyAlphabetsAndSpace)
    }, [typingSentence])

    const charIndex = charTyped.length
    const [autoSpacing, setAutoSpacing] = useState(false)
    const [preventIncorrect, setPreventIncorrect] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const { progress, incorrectChar, cursor, charTypedInfo } = useListenTyping(
        characterArray,
        charTyped,
        setCharTyped,
        preventIncorrect,
        isTyping,
        setIsTyping,
        gameOver
    )
    const { timer, startTimer, stopTimer } = useTimer()
    const score = useCalculateScore(
        isTyping,
        timer,
        cursor,
        incorrectChar.length,
        gameOver
    )

    useEffect(() => {
        if (isTyping && cursor <= 1 && 30 >= timer) {
            startTimer()
        }

        if (30 <= timer && isTyping) {
            stopTimer()
            setIsTyping(!isTyping)
            setGameOver(true)
        }
    }, [timer, cursor, isTyping])

    useCookiesScore({ gameover: gameOver, wpm: score.wpm, data: charTypedInfo })
    const { timexwpm } = useTimexWpm({ timer: timer, wpm: score.wpm })
    return (
        <div className="flex flex-1 flex-col justify-center items-center w-screen overflow-hidden min-h-screen">
            <div className="flex flex-row justify-start items-center gap-5">
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

            <div>
                <div className="text-3xl font-jetBrainsMono font-bold">
                    <div className="flex flex-col gap-3 justify-center items-center ">
                        <div className="flex flex-row gap-10 ">
                            <p>{'Wpm: ' + score.wpm}</p>
                            <p>{'Time: ' + timer}</p>
                        </div>
                        <div>
                            <p className="mb-3">
                                {characterArray[cursor] == ' ' ||
                                characterArray[cursor] == '\u2000'
                                    ? 'space'
                                    : characterArray[cursor]}
                            </p>
                        </div>
                    </div>

                    {/* <p>{'Accuracy: ' + score.accuracy}</p> */}
                    {/* <p>{isTyping ? 'Typing' : 'Not Typing'}</p> */}
                </div>
            </div>
            <div className="left-[45%] max-w-full relative overflow-hidden w-full">
                <div className="flex flex-row gap-10">
                    <div className="z-20    absolute ">
                        <Image
                            src={'/blured-sides/fade-text-left.png'}
                            alt="typing"
                            height={0}
                            width={100}
                            className="w-[100px] z-20"
                        />
                    </div>

                    <div
                        style={{ transform: `translateX(-${progress}%)` }}
                        className={`pl-20 flex flex-row font-jetBrainsMono justify-start items-center md:text-2xl lg:text-3xl relative transition duration-1000 ease-out `}
                    >
                        {characterArray.map((character, index) => {
                            return (
                                <p
                                    key={index}
                                    className={clsx(
                                        {
                                            'text-gray-500': index > charIndex,
                                        },
                                        {
                                            'text-black':
                                                index < charIndex ||
                                                !incorrectChar.includes(index),
                                        },
                                        {
                                            'text-red-500':
                                                index < charIndex &&
                                                incorrectChar.includes(index) &&
                                                !preventIncorrect,
                                        },

                                        {
                                            'font-bold': index == charIndex,
                                            'text-3xl': index == charIndex,
                                            'text-green-400':
                                                index == charIndex,
                                        }
                                    )}
                                >
                                    {character}
                                </p>
                            )
                        })}
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
            </div>

            {/* <div
                className={`flex flex-row font-jetbrains justify-start items-center md:text-2xl lg:text-3xl relative transition duration-1000 ease-out`}
            >
                {characterArray.map((character, index) => {
                    return (
                        <p
                            key={index}
                            className={clsx(
                                'text-gray-500',
                                {
                                    'text-white': index < charIndex,
                                },
                                {
                                    'font-extrabold': index == charIndex,
                                    'text-3xl': index == charIndex,
                                    'text-green-400': index == charIndex,
                                },
                                {
                                    'text-red-500':
                                        incorrectChar.includes(index),
                                }
                            )}
                        >
                            {character}
                        </p>
                    )
                })}
            </div> */}
            {gameOver ? (
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
            )}
            {gameOver ? (
                <div>
                    <TimexWpm data={timexwpm} />
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}
