'use client'
import useCursor from '@/app/hooks/curosrAnimationHook/useCursorAnimation'
import useRandomColor from '@/app/hooks/useRandomColor'
import useTimer from '@/app/hooks/useTimer'
import { useTimexWpm } from '@/app/hooks/useTimeXWpm'
import useListenTyping from '@/app/hooks/useTypingRoom'
import useCustomRoomSocket from '@/app/hooks/websockethooks/useCustomSocketRoom'
import OnBoarding from '@/app/multiplayer/onBoarding'
import { getBadgeImage } from '@/components/BadgeComponent'
import ShowGraph from '@/components/graph/showGraph'
import ReloadButton from '@/components/reload/reload'
import Score from '@/components/ScoreCard/Score'
import { useUser } from '@clerk/nextjs'
import clsx from 'clsx'
import { Copy, CrownIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminScoreBoard from './adminScoreBoard'

const ToggleSpectator = ({
    toggle,
    role,
    isAdmin,
}: {
    toggle: () => void
    role: string
    isAdmin: boolean
}) => {
    return (
        <div
            className={clsx({
                hidden: role === '' || role === null || !isAdmin,
            })}
        >
            <div className="bg-gray-50 px-5 py-3 rounded-lg flex flex-row justify-between items-center">
                {role !== '' && role !== null && (
                    <div className="flex flex-col flex-1 w-full">
                        <p className="flex flex-1 text-md mb-2 ">
                            Change Admin Role
                        </p>
                        <div className="flex flex-1 justify-between items-center ">
                            <p className="text-md">Spectator</p>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={role === 'spectator'}
                                        onChange={() => toggle()}
                                    />
                                    <div
                                        className={clsx(
                                            'block w-10 h-6 rounded-full transition duration-200',
                                            {
                                                'bg-gray-600':
                                                    role !== 'spectator',
                                                'bg-green-400':
                                                    role === 'spectator',
                                            }
                                        )}
                                    ></div>
                                    <div
                                        className={clsx(
                                            'dot absolute left-1 top-1 w-4 h-4 rounded-full transition',
                                            {
                                                'transform translate-x-full bg-white duration-200':
                                                    role === 'spectator',
                                                'bg-green-400 duration-200':
                                                    role !== 'spectator',
                                            }
                                        )}
                                    ></div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
const Room = () => {
    const route: any = useParams()
    const query = useSearchParams()
    const { user, isSignedIn } = useUser()
    const { colors } = useRandomColor()
    const [charTyped, setCharTyped] = useState([])
    const [typingSentence, setTypingSentence] = useState('')
    const [characterArray, setCharacterArray] = useState<string[]>([])
    const charIndex = charTyped.length

    const [preventIncorrect, setPreventIncorrect] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const { timer, startTimer, stopTimer } = useTimer()
    const [timerOption, setTimerOption] = useState(30)
    const ResetTimer = () => {
        setTimerOption(30)
    }
    const {
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
    const [multiplier, setMultiplier] = useState(1)
    const numberOfCharacters = 300

    const cursorPosition = useCursor({ cursor })
    useEffect(() => {
        if (charIndex > numberOfCharacters * multiplier) {
            setMultiplier((prev) => prev + 1)
        }
    }, [charIndex])
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

    const {
        state: {
            roomData,
            isConnected,
            error,
            isAdmin,
            countDown,
            gameState,
            finalState,
            scoreBoardState,
        },
        actions: {
            kickPlayer,
            updateCapacity,
            toggleReady,
            sendTimeout,
            setGameState,
            sendResults,
            sendWpmUpdate,
            kickPlayerByUsername,
            updateRoomCapacity,
            sendFinalStats,
            notifyTimeout,
            toggleAdminRole,
        },
    } = useCustomRoomSocket({
        username: user?.username || '',
        roomId: route.room,
        functions: { ResetTimer: ResetTimer },
    })

    useEffect(() => {
        setTypingSentence(roomData.data.text)
    }, [roomData.data.text])

    useEffect(() => {
        if (gameState == 'finished') {
            setGameOver(true)
            setIsTyping(false)
            sendResults(timexwpm, _wpm)
        }
    }, [gameState])

    const { timexwpm } = useTimexWpm({ timer: timer, wpm: _wpm })

    useEffect(() => {
        let interval: any = null
        if (gameState == 'in_progress') {
            interval = setInterval(() => {
                let wpm = _wpm
                sendWpmUpdate(wpm)
            }, 500)
        }
        return () => clearInterval(interval)
    }, [gameState, _wpm])

    useEffect(() => {
        if (gameState === 'in_progress') {
            setIsTyping(true)
        }
    }, [gameState])
    return (
        <>
            {gameState === 'connecting' || gameState === 'waiting' ? (
                <>
                    <div className="flex justify-center items-center font-jetBrainsMono ">
                        <div className="flex flex-col gap-4 ">
                            {isAdmin &&
                                query?.get('username') ===
                                    roomData.room_admin && (
                                    <div className="flex flex-row justify-between items-center bg-gray-600 rounded-lg  text-white py-1 pointer-cursor">
                                        <div className=" rounded-full pl-4">
                                            <p>Copy Room URL</p>
                                        </div>
                                        <div
                                            className="bg-gray-600 rounded-lg p-2 mr-1 cursor-pointer duration-300 hover:text-green-400"
                                            onClick={() => {
                                                const link = new URL(
                                                    '/room/' + route.room,
                                                    window.location.origin
                                                ).toString()
                                                navigator.clipboard.writeText(
                                                    link
                                                )
                                            }}
                                        >
                                            <Copy size={18} />
                                        </div>
                                    </div>
                                )}

                            <div className="flex flex-row justify-between items-center bg-gray-600  text-white py-1 rounded-lg  pointer-cursor">
                                <div className=" rounded-full pl-4">
                                    <p> Room Code - </p>
                                </div>
                                <div
                                    className=" rounded-lg p-2 mr-1 cursor-pointer duration-300 hover:text-green-400 "
                                    onClick={() => {
                                        const link = new URL(
                                            '/room/' + route.room,
                                            window.location.origin
                                        ).toString()
                                        navigator.clipboard.writeText(link)
                                    }}
                                >
                                    {route.room}
                                </div>
                            </div>

                            <ToggleSpectator
                                toggle={() => {
                                    toggleAdminRole()
                                }}
                                role={roomData.admin_role}
                                isAdmin={isAdmin}
                            />

                            <div
                                className={clsx(
                                    'bg-gray-50 rounded-lg overflow-clip'
                                )}
                            >
                                <div
                                    className={clsx(
                                        `bg-green-400 h-2 top-0 transition duration-300`,
                                        {
                                            'w-[33.33%]': countDown === 3,
                                            'w-[66.66%]': countDown === 2,
                                            'w-[100%]': countDown === 1,
                                            'w-0': countDown === 0,
                                        }
                                    )}
                                ></div>

                                <div className="m-5">
                                    {Object.entries(roomData.data.players).map(
                                        ([player, state], index) => {
                                            const { highestWpm } = state as any
                                            return (
                                                <div
                                                    className="flex flex-1 w-full px-0 py-2 justify-center items-center"
                                                    key={player}
                                                >
                                                    <div className="mr-3 ">
                                                        {roomData.room_admin ===
                                                        player ? (
                                                            <div className="p-2 rounded-full bg-yellow-500 opacity-100 ">
                                                                <CrownIcon
                                                                    size={18}
                                                                />{' '}
                                                            </div>
                                                        ) : (
                                                            <div className="invisible p-2 rounded-full bg-yellow-500 opacity-100 ">
                                                                <CrownIcon
                                                                    size={18}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-row gap-4 justify-center items-center ">
                                                        <p className="text-black/70 font-semibold">
                                                            #{index + 1}
                                                        </p>

                                                        <div>
                                                            <Image
                                                                src={`/throphies/badges/${getBadgeImage(
                                                                    Math.round(
                                                                        Number(
                                                                            highestWpm
                                                                        )
                                                                    )
                                                                )}`}
                                                                alt=""
                                                                width={60}
                                                                height={60}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            `  flex p-2 flex-1 items-center justify-between cursor-pointer gap-1`,
                                                            {
                                                                'opacity-100 transition duration-300':
                                                                    state.isReady,
                                                            },
                                                            {
                                                                'opacity-50 transition duration-300 ':
                                                                    !state.isReady,
                                                            }
                                                        )}
                                                    >
                                                        <p>{player}</p>
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
                                    {isAdmin ? (
                                        <>
                                            {' '}
                                            <div
                                                onClick={() => {
                                                    toggleReady()
                                                }}
                                                className="flex justify-center items-center bg-green-400 rounded-md py-2 px-4 cursor-pointer hover:bg-green-500 duration-300"
                                            >
                                                <div>Ready</div>
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
            {
                <>
                    {isAdmin ? (
                        <>
                            {' '}
                            {roomData.admin_role === 'spectator' ? (
                                <AdminScoreBoard
                                    roomData={scoreBoardState || []}
                                    isAdmin={isAdmin}
                                    roomAdmin={roomData.room_admin || ''}
                                />
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </>
            }
            {isAdmin ? (
                <>
                    {roomData.admin_role == 'player' ? (
                        <>
                            {gameState === 'in_progress' ||
                            gameState === 'finished' ? (
                                <>
                                    <>
                                        {user?.username && isSignedIn ? (
                                            <>
                                                <p>{gameOver}</p>
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
                                                                cursorPosition.x -
                                                                2
                                                            }px, ${
                                                                cursorPosition.y -
                                                                99
                                                            }px)`,
                                                        }}
                                                    ></div>
                                                </div>
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
                                                        ></div>
                                                    )}

                                                    <ReloadButton
                                                        gameOver={gameOver}
                                                    />

                                                    {/* {gameOver ? (
                                        <RankingStage data={finalState} />
                                    ) : (
                                        <></>
                                    )} */}

                                                    {gameOver ? (
                                                        <div className="flex flex-1 flex-row mt-20">
                                                            <div>
                                                                <Score
                                                                    data={
                                                                        charTypedInfo
                                                                    }
                                                                    _wpm={_wpm}
                                                                    timexwpm={
                                                                        timexwpm
                                                                    }
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
                                                                    {/* <TimexWpmRoom
                                                        data={finalState}
                                                        timer={timer}
                                                    /> */}
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
                                                                    <ShowGraph
                                                                        data={
                                                                            charTypedInfo
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {/* {finalState?.players.length >
                                                0 ? (
                                                    <RankUsers
                                                        data={
                                                            finalState?.players
                                                        }
                                                    />
                                                ) : (
                                                    <></>
                                                )} */}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}

                                                    <div
                                                        className={clsx(
                                                            'transition duration-500',
                                                            {
                                                                'max-h-0 opacity-0 scale-0 ':
                                                                    gameOver,
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
                                                                    <p>
                                                                        {'Wpm: ' +
                                                                            _wpm}
                                                                    </p>
                                                                    <p>
                                                                        {'Time: ' +
                                                                            timer}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    {characterArray.length >
                                                                    0 ? (
                                                                        <p className="mb-3">
                                                                            {characterArray[
                                                                                cursor
                                                                            ] ==
                                                                                ' ' ||
                                                                            characterArray[
                                                                                cursor
                                                                            ] ==
                                                                                '\u2000'
                                                                                ? 'space'
                                                                                : characterArray[
                                                                                      cursor
                                                                                  ]}
                                                                        </p>
                                                                    ) : (
                                                                        <p className="mb-3 invisible">
                                                                            a
                                                                        </p>
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

                                                            {
                                                                'max-h-0 opacity-0 scale-0 ':
                                                                    gameOver,
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
                                                            {characterArray.length >
                                                            0 ? (
                                                                characterArray.map(
                                                                    (
                                                                        character,
                                                                        index
                                                                    ) => {
                                                                        if (
                                                                            index >=
                                                                                numberOfCharacters *
                                                                                    (multiplier -
                                                                                        1) &&
                                                                            index <=
                                                                                numberOfCharacters *
                                                                                    multiplier
                                                                        )
                                                                            return (
                                                                                <p
                                                                                    key={
                                                                                        index
                                                                                    }
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
                                                                                    {
                                                                                        character
                                                                                    }
                                                                                </p>
                                                                            )
                                                                    }
                                                                )
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
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <>
                    {gameState === 'in_progress' || gameState === 'finished' ? (
                        <>
                            <>
                                {user?.username && isSignedIn ? (
                                    <>
                                        <p>{gameOver}</p>
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
                                                    }px, ${
                                                        cursorPosition.y - 99
                                                    }px)`,
                                                }}
                                            ></div>
                                        </div>
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
                                                ></div>
                                            )}

                                            <ReloadButton gameOver={gameOver} />

                                            {/* {gameOver ? (
                                        <RankingStage data={finalState} />
                                    ) : (
                                        <></>
                                    )} */}

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
                                                            {/* <TimexWpmRoom
                                                        data={finalState}
                                                        timer={timer}
                                                    /> */}
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
                                                            <ShowGraph
                                                                data={
                                                                    charTypedInfo
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* {finalState?.players.length >
                                                0 ? (
                                                    <RankUsers
                                                        data={
                                                            finalState?.players
                                                        }
                                                    />
                                                ) : (
                                                    <></>
                                                )} */}
                                                    </div>
                                                </div>
                                            ) : (
                                                <></>
                                            )}

                                            <div
                                                className={clsx(
                                                    'transition duration-500',
                                                    {
                                                        'max-h-0 opacity-0 scale-0 ':
                                                            gameOver,
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
                                                            <p>
                                                                {'Wpm: ' + _wpm}
                                                            </p>
                                                            <p>
                                                                {'Time: ' +
                                                                    timer}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            {characterArray.length >
                                                            0 ? (
                                                                <p className="mb-3">
                                                                    {characterArray[
                                                                        cursor
                                                                    ] == ' ' ||
                                                                    characterArray[
                                                                        cursor
                                                                    ] ==
                                                                        '\u2000'
                                                                        ? 'space'
                                                                        : characterArray[
                                                                              cursor
                                                                          ]}
                                                                </p>
                                                            ) : (
                                                                <p className="mb-3 invisible">
                                                                    a
                                                                </p>
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

                                                    {
                                                        'max-h-0 opacity-0 scale-0 ':
                                                            gameOver,
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
                                                    {characterArray.length >
                                                    0 ? (
                                                        characterArray.map(
                                                            (
                                                                character,
                                                                index
                                                            ) => {
                                                                if (
                                                                    index >=
                                                                        numberOfCharacters *
                                                                            (multiplier -
                                                                                1) &&
                                                                    index <=
                                                                        numberOfCharacters *
                                                                            multiplier
                                                                )
                                                                    return (
                                                                        <p
                                                                            key={
                                                                                index
                                                                            }
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
                                                                            {
                                                                                character
                                                                            }
                                                                        </p>
                                                                    )
                                                            }
                                                        )
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
                        </>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </>
    )
}

export default Room
