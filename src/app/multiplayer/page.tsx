'use client'
import { useEffect, useState } from 'react'
import useListenTyping from '../hooks/useTypingRoom'
import clsx from 'clsx'
import useTimer from '../hooks/useTimer'
import Score from '@/components/ScoreCard/Score'
import { useTimexWpm } from '../hooks/useTimeXWpm'
import TimexWpmRoom from '@/components/graph/timexwpmGraphRoom'
import ShowGraph from '@/components/graph/showGraph'
import useCursor from '../hooks/curosrAnimationHook/useCursorAnimation'
import useGhostCursor from '../hooks/curosrAnimationHook/useGhostCursor'
import useSocket from '../hooks/websockethooks/useSockets'
import useRandomColor from '../hooks/useRandomColor'
import RankUsers, { RankingStage } from './_ranks/rankUsers'
import OnBoarding from './onBoarding'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { getBadgeImage } from '@/components/BadgeComponent'
import Link from 'next/link'
import ReloadButton from '@/components/reload/reload'
import LobbyText from './component/LobbyText'

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
    const {
        progress,
        incorrectChar,
        cursor,
        charTypedInfo,
        wpm: _wpm,
    } = useListenTyping(
        characterArray,
        charTyped,
        setCharTyped,
        preventIncorrect,
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

    // useCookiesScore({ gameover: gameOver, wpm: _wpm, data: charTypedInfo })
    const { timexwpm } = useTimexWpm({ timer: timer, wpm: _wpm })

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
        wpm: _wpm,
    })
    useEffect(() => {
        if (gameState === 'in_progress') {
            setIsTyping(true)
            startTimer()
        }
    }, [gameState])

    useEffect(() => {
        setTypingSentence(roomData.roomText)
    }, [roomData.roomText])

    useEffect(() => {
        if (gameState == 'finished') {
            sendResults(timexwpm, _wpm)
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
                                    'flex flex-col justify-center items-center',
                                    {
                                        ' flex-row hidden transition duration-500 ease-out':
                                            isTyping,
                                    },
                                    {
                                        'flex justify-center  flex-row relative mb-20  font-jetBrainsMono rounded-lg':
                                            true,
                                    }
                                )}
                            >
                                <div>
                                    <div className="flex flex-1 flex-col justify-center items-center mb-5">
                                        <p className="text-2xl font-bold">
                                            Waiting Lobby
                                        </p>
                                        <p className="text-xl text-black/80 ">
                                            Players:{' '}
                                            <span className="">
                                                {' '}
                                                {
                                                    Object.keys(
                                                        roomData.roomInfo
                                                    ).length
                                                }
                                            </span>
                                            /4
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className={clsx(
                                            'flex flex-1 flex-col items-start  rounded-t-md pb-3 ',
                                            {
                                                'flex flex-1 flex-col items-start bg-white  rounded-t-md pb-3':
                                                    Object.entries(
                                                        roomData.roomInfo
                                                    ).length > 0,
                                            }
                                        )}
                                    >
                                        {Object.entries(roomData.roomInfo)
                                            .length != 0 ? (
                                            <>
                                                {Array.from({ length: 4 }).map(
                                                    (_, index) => {
                                                        const playerData =
                                                            Object.entries(
                                                                roomData.roomInfo
                                                            )[index]
                                                        const player =
                                                            playerData
                                                                ? playerData[0]
                                                                : `Player ${
                                                                      index + 1
                                                                  }`
                                                        const notNull =
                                                            playerData
                                                                ? true
                                                                : false
                                                        const state = playerData
                                                            ? playerData[1]
                                                            : {
                                                                  currentPosition:
                                                                      '',
                                                                  isReady:
                                                                      false,
                                                                  highestWpm: 0,
                                                              }
                                                        const typedValues =
                                                            state as {
                                                                currentPosition: string
                                                                isReady: boolean
                                                                highestWpm: number
                                                            }

                                                        return (
                                                            <div
                                                                className="flex flex-1 w-full px-6 py-2 justify-center items-center"
                                                                key={player}
                                                            >
                                                                <div className="flex flex-row gap-4 justify-center items-center ">
                                                                    <p className="text-black/70 font-semibold">
                                                                        #
                                                                        {index +
                                                                            1}
                                                                    </p>
                                                                    <div>
                                                                        <Image
                                                                            src={`/throphies/${
                                                                                notNull
                                                                                    ? `badges/${getBadgeImage(
                                                                                          Math.round(
                                                                                              Number(
                                                                                                  state.highestWpm
                                                                                              )
                                                                                          )
                                                                                      )}`
                                                                                    : `dummy/Badge_0${
                                                                                          index -
                                                                                          1
                                                                                      }.svg`
                                                                            }`}
                                                                            alt=""
                                                                            width={
                                                                                60
                                                                            }
                                                                            height={
                                                                                60
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={clsx(
                                                                        `  flex p-2 flex-1 items-center justify-between cursor-pointer gap-1`,
                                                                        {
                                                                            'opacity-100 transition duration-300':
                                                                                typedValues.isReady,
                                                                        },
                                                                        {
                                                                            'opacity-50 transition duration-300 ':
                                                                                !typedValues.isReady,
                                                                        }
                                                                    )}
                                                                >
                                                                    <p>
                                                                        {player}
                                                                    </p>
                                                                    {user?.username ==
                                                                    player ? (
                                                                        <span className="bg-green-500 text-white rounded-full px-2 text-xs mr-3">
                                                                            you
                                                                        </span>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    <span
                                                                        className={clsx(
                                                                            `${colors[index]} w-2 h-7 rounded-full flex `
                                                                        )}
                                                                    ></span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    {Object.entries(roomData.roomInfo).length !=
                                    0 ? (
                                        <div
                                            className={clsx(
                                                ' p-2 justify-center items-center flex cursor-pointer rounded-b-md',
                                                {
                                                    'bg-green-500':
                                                        playerControls,
                                                },
                                                {
                                                    'bg-red-500':
                                                        !playerControls,
                                                },
                                                {
                                                    hidden:
                                                        Object.entries(
                                                            roomData.roomInfo
                                                        ).length == 0,
                                                }
                                            )}
                                            onClick={() => {
                                                if (gameState !== 'countdown') {
                                                    toggleReady()
                                                }
                                            }}
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
                                    ) : (
                                        <p>Loading...</p>
                                    )}
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
                        <ReloadButton gameOver={gameOver} />

                        {gameOver ? <RankingStage data={finalState} /> : <></>}

                        {gameOver ? (
                            <div className="flex flex-1 flex-row mt-20">
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
                                        <p>{'Wpm: ' + _wpm}</p>
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
                            {characterArray.length > 0 ? (
                                <LobbyText
                                    characterArray={characterArray}
                                    charactersToShow={charactersToShow}
                                    charIndex={charIndex}
                                    numberOfCharacters={numberOfCharacters}
                                    multiplier={multiplier}
                                    incorrectChar={incorrectChar}
                                    isTyping={isTyping}
                                />
                            ) : (
                                <div className="">
                                    <h1 className="moving-text ">generating</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <OnBoarding />
            )}
        </>
    )
}
