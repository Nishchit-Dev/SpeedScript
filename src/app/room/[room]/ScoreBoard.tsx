import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { CrownIcon, Play } from 'lucide-react'
import clsx from 'clsx'
import { useUser } from '@clerk/nextjs'

import useRandomColor from '@/app/hooks/useRandomColor'
import { getBadgeImage } from '@/components/BadgeComponent'

const GameState = {
    CONNECTING: 'connecting',
    WAITING: 'waiting',
    COUNTDOWN: 'countdown',
    IN_PROGRESS: 'in_progress',
    FINISHED: 'finished',
    GAME_RESET: 'game_reset',
} as const

interface ScoreBoardMessage {
    username: string
    wpm: number
}

interface finalRoomState {
    players: {
        username: string
        stats: {
            time: number
            wpm: number
        }[]
        wpm: number
        rank: number
        finishTime: number
        roomId: string
    }[]
    roomId: string
}
const AdminScoreBoard = ({
    finalState,
    roomData,
    isAdmin,
    roomAdmin,
    ResetFunction,
    gameStatus,
}: {
    finalState: finalRoomState
    roomData: ScoreBoardMessage[]
    isAdmin: boolean
    roomAdmin: string
    gameStatus: string
    ResetFunction: () => void
}) => {
    const { user } = useUser()
    const { colors } = useRandomColor()

    // Local state to store and sort the scoreboard data
    const [scoreData, setScoreData] = useState<ScoreBoardMessage[]>([])
    const [soretedFinalScore, setSoretedFinalScoreData] =
        useState<finalRoomState>({ players: [], roomId: '' })

    useEffect(() => {
        // Sort roomData by descending WPM whenever roomData changes
        if (roomData.length > 1) {
            const sorted = [...roomData].sort((a, b) => b.wpm - a.wpm)
            setScoreData(sorted)
        }else{
            setScoreData(roomData)
        }
    }, [roomData])

    useEffect(() => {
        if (roomData.length > 1) {
            const sorted = [...finalState.players].sort((a, b) => b.wpm - a.wpm)
            setSoretedFinalScoreData((prev) => {
                return { ...prev, players: sorted }
            })
        }else{
            setSoretedFinalScoreData((prev) => {
                return { ...prev, players: finalState.players }
            })
        }
    }, [finalState.players])

    return (
        <div className="flex flex-1 flex-col justify-center items-center">
            {gameStatus === 'in_progress' ? (
                <>
                    {scoreData.length <= 0 ? null : (
                        <div className="m-5 font-jetBrainsMono w-max flex flex-col items-center justify-center gap-2 ">
                            {/* AnimatePresence helps with mount/unmount animations; 
              layout prop helps animate reordering within the list */}
                            <AnimatePresence>
                                {scoreData.map((player, index) => {
                                    const { username, wpm } = player
                                    const rank = index + 1

                                    return (
                                        <motion.div
                                            key={username}
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 30,
                                            }}
                                            className="flex bg-white w-full px-6 py-2 justify-center items-center rounded-lg"
                                        >
                                            {/* Admin Crown */}
                                            {/* <div className="">
                                        {roomAdmin === username ? (
                                            <div className="p-2 rounded-full bg-yellow-500">
                                                <CrownIcon size={18} />
                                            </div>
                                        ) : (
                                            // Keep this div to preserve layout even for non-admin players
                                            <div className="invisible p-2 rounded-full bg-yellow-500">
                                                <CrownIcon size={18} />
                                            </div>
                                        )}
                                    </div> */}

                                            {/* Rank + Trophy */}
                                            <div className="flex flex-row gap-4 justify-center items-center">
                                                <p className="text-black/70 font-semibold">
                                                    #{rank}
                                                </p>
                                                <Image
                                                    src={`/throphies/badges/${getBadgeImage(
                                                        Math.round(Number(wpm))
                                                    )}`}
                                                    alt="badge"
                                                    width={60}
                                                    height={60}
                                                />
                                            </div>

                                            {/* Username & WPM */}
                                            <div
                                                className={clsx(
                                                    `flex p-2 flex-1 items-center justify-between gap-1 cursor-pointer`
                                                )}
                                            >
                                                <p>{username}</p>
                                                {user?.username === username ? (
                                                    <span className="bg-green-500 text-white rounded-full px-2 text-xs mr-3">
                                                        you
                                                    </span>
                                                ) : null}
                                                <span
                                                    className={clsx(
                                                        `${colors[index]} w-2 h-7 rounded-full flex`
                                                    )}
                                                />
                                                <span
                                                    className={clsx(
                                                        `bg-white w-12 h-12 rounded-full flex justify-center items-center`
                                                    )}
                                                >
                                                    {wpm}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}

            {gameStatus === 'finished' ? (
                <>
                    {soretedFinalScore.players.length <= 0 ? null : (
                        <div className="m-5 font-jetBrainsMono w-max flex flex-col items-center justify-center gap-2 ">
                            <AnimatePresence>
                                {soretedFinalScore.players.map(
                                    (player, index) => {
                                        const { username, wpm } = player
                                        const rank = index + 1

                                        return (
                                            <motion.div
                                                key={username}
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    y: -10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                                className="flex bg-white w-full px-6 py-2 justify-center items-center rounded-lg"
                                            >
                                                {/* Admin Crown */}
                                                {/* <div className="">
                                        {roomAdmin === username ? (
                                            <div className="p-2 rounded-full bg-yellow-500">
                                                <CrownIcon size={18} />
                                            </div>
                                        ) : (
                                            // Keep this div to preserve layout even for non-admin players
                                            <div className="invisible p-2 rounded-full bg-yellow-500">
                                                <CrownIcon size={18} />
                                            </div>
                                        )}
                                    </div> */}

                                                {/* Rank + Trophy */}
                                                <div className="flex flex-row gap-4 justify-center items-center">
                                                    <p className="text-black/70 font-semibold">
                                                        #{rank}
                                                    </p>
                                                    <Image
                                                        src={`/throphies/badges/${getBadgeImage(
                                                            Math.round(
                                                                Number(wpm)
                                                            )
                                                        )}`}
                                                        alt="badge"
                                                        width={60}
                                                        height={60}
                                                    />
                                                </div>

                                                {/* Username & WPM */}
                                                <div
                                                    className={clsx(
                                                        `flex p-2 flex-1 items-center justify-between gap-1 cursor-pointer`
                                                    )}
                                                >
                                                    <p>{username}</p>
                                                    {user?.username ===
                                                    username ? (
                                                        <span className="bg-green-500 text-white rounded-full px-2 text-xs mr-3">
                                                            you
                                                        </span>
                                                    ) : null}
                                                    <span
                                                        className={clsx(
                                                            `${colors[index]} w-2 h-7 rounded-full flex`
                                                        )}
                                                    />
                                                    <span
                                                        className={clsx(
                                                            `bg-white w-12 h-12 rounded-full flex justify-center items-center`
                                                        )}
                                                    >
                                                        {wpm}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )
                                    }
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

const DummyUsers = ({ numberOfUsers = 0 }: { numberOfUsers: number }) => {
    return (
        <>
            <div className="mx-5 font-jetBrainsMono w-max flex flex-col items-center justify-center gap-2 ">
                <AnimatePresence>
                    {[...Array(numberOfUsers)].map((_, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 30,
                            }}
                            className="flex bg-white w-full px-6 py-2 justify-center items-center rounded-lg"
                        >
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <p className="text-black/70 font-semibold">
                                    #{index + 1}
                                </p>
                                <Image
                                    src={`/throphies/badges/${getBadgeImage(
                                        Math.round(Number(99))
                                    )}`}
                                    alt="badge"
                                    width={60}
                                    height={60}
                                />
                            </div>

                            {/* Username & WPM */}
                            <div
                                className={clsx(
                                    `flex p-2 flex-1 items-center justify-between gap-1 cursor-pointer`
                                )}
                            >
                                <p>{'dummy'}</p>
                                {index == 8 ? (
                                    <span className="bg-green-500 text-white rounded-full px-2 text-xs mr-3">
                                        you
                                    </span>
                                ) : null}
                                <span
                                    className={clsx(
                                        ` w-2 h-7 rounded-full flex`
                                    )}
                                />
                                <span
                                    className={clsx(
                                        `bg-white w-12 h-12 rounded-full flex justify-center items-center`
                                    )}
                                >
                                    {99}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    )
}

export const UserScoreBoard = ({
    finalState,
    roomData,
    ResetFunction,
    gameStatus,
}: {
    finalState: finalRoomState
    roomData: ScoreBoardMessage[]
    gameStatus: string
    ResetFunction: () => void
}) => {
    const { user } = useUser()
    const { colors } = useRandomColor()

    // Local state to store and sort the scoreboard data
    const [scoreData, setScoreData] = useState<ScoreBoardMessage[]>([])
    const [soretedFinalScore, setSoretedFinalScoreData] =
        useState<finalRoomState>({ players: [], roomId: '' })

    useEffect(() => {
        if (roomData.length > 1) {
            const sorted = [...finalState.players].sort((a, b) => b.wpm - a.wpm)
            setSoretedFinalScoreData((prev) => {
                return { ...prev, players: sorted }
            })
        } else {
            setSoretedFinalScoreData((prev) => {
                return { ...prev, players: finalState.players }
            })
        }
    }, [finalState.players])

    return (
        <div className="flex flex-1 flex-col justify-start items-center overflow-y-auto max-h-screen">
            {gameStatus === 'finished' || gameStatus === 'in_progress' ? (
                <>
                    {soretedFinalScore.players.length <= 0 ? null : (
                        <div className="mx-5 font-jetBrainsMono w-max flex flex-col items-center justify-center gap-2 ">
                            {/* AnimatePresence helps with mount/unmount animations; 
layout prop helps animate reordering within the list */}
                            <AnimatePresence>
                                {soretedFinalScore.players.map(
                                    (player, index) => {
                                        const { username, wpm } = player
                                        const rank = index + 1

                                        return (
                                            <motion.div
                                                key={username}
                                                layout
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                                className="flex bg-white w-full px-6 py-2 justify-center items-center rounded-lg"
                                            >
                                                <div className="flex flex-row gap-4 justify-center items-center">
                                                    <p className="text-black/70 font-semibold">
                                                        #{rank}
                                                    </p>
                                                    <Image
                                                        src={`/throphies/badges/${getBadgeImage(
                                                            Math.round(
                                                                Number(wpm)
                                                            )
                                                        )}`}
                                                        alt="badge"
                                                        width={60}
                                                        height={60}
                                                    />
                                                </div>

                                                {/* Username & WPM */}
                                                <div
                                                    className={clsx(
                                                        `flex p-2 flex-1 items-center justify-between gap-1 cursor-pointer`
                                                    )}
                                                >
                                                    <p>{username}</p>
                                                    {user?.username ===
                                                    username ? (
                                                        <span className="bg-green-500 text-white rounded-full px-2 text-xs mr-3">
                                                            you
                                                        </span>
                                                    ) : null}
                                                    <span
                                                        className={clsx(
                                                            `${colors[index]} w-2 h-7 rounded-full flex`
                                                        )}
                                                    />
                                                    <span
                                                        className={clsx(
                                                            `bg-white w-12 h-12 rounded-full flex justify-center items-center`
                                                        )}
                                                    >
                                                        {wpm}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )
                                    }
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

export default AdminScoreBoard
