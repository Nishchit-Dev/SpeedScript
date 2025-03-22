'use client'
import { clsx } from 'clsx'
import { useLeaderboard } from '../hooks/leaderBoard/useLeaderBoard'
import { ArrowLeft, ArrowRight, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { GlareCard } from '@/components/ui/glare-ui'
import Image from 'next/image'
import React from 'react'
import { getBadgeImage } from '@/components/BadgeComponent'
import { useUser } from '@clerk/nextjs'
import { DurationSelector } from './durationSelector'
import DynamicDailyLeaderboardComponent from './component/DynamicDailyLeaderboard'
import DynamicLeaderBoardComponent from './component/DynamicLeaderboard'
import DynamicStage from './component/DynamicStage'

interface data {
    username: string
    clerkId: string
    _id: string
    highestWpm: {
        highestScore10s: number
        highestScore30s: number
        highestScore60s: number
        highestScore120s: number
    }
    dailyHighestWpm: {
        dailyHighestScore10s: number
        dailyHighestScore30s: number
        dailyHighestScore60s: number
        dailyHighestScore120s: number
    }
}

const LeaderboardButton = ({
    flag,
    setFlag,
}: {
    flag: boolean
    setFlag: (flag: boolean) => void
}) => {
    return (
        <>
            <div className="bg-gray-600 flex flex-row rounded-sm p-1 text-black/70 font-jetBrainsMono mb-5 gap-2">
                <div
                    className={clsx(
                        ' px-5 py-2 rounded-full cursor-pointer ',
                        { 'text-green-400 ': flag },
                        { 'text-white/70 hover:opacity-65': !flag }
                    )}
                    onClick={() => setFlag(!flag)}
                >
                    <p>All Time</p>
                </div>
                <div
                    onClick={() => setFlag(!flag)}
                    className={clsx(
                        ' px-5 py-2 rounded-full  cursor-pointer hover:opacity-65',
                        { 'text-green-300': !flag },
                        { 'text-white/70 hover:opacity-65': flag }
                    )}
                >
                    <p>Daily</p>
                </div>
            </div>
        </>
    )
}

interface UserRank {
    _id: string
    clerkId: string
    highestWpm: number
    dailyHighestWpm: number
    highestRank: number
    dailyRank: number
    rank: number // Add this line if the API actually returns a rank property
}
const UserScoreBoard = ({ flag }: { flag: boolean }) => {
    const { getRank, userRank, duration } = useLeaderboard({})
    const { user } = useUser()
    const [_user, setUser] = useState<data | null>(null)

    useEffect(() => {
        if (user) {
            getRank(user.id, duration)
            if (user?.username) {
                setUser((prev: any) => {
                    return { ...prev, username: user.username || null }
                })
            }
        }
    }, [user?.username, duration, getRank])

    return (
        <>
            {user?.username ? (
                <div
                    className={clsx(
                        'mb-5',
                        { hidden: !flag },
                        { visible: userRank?.highestRank != -1 }, // Changed rank to highestRank
                        { hidden: userRank?.highestRank == -1 } // Changed rank to highestRank
                    )}
                >
                    <div>
                        <GlareCard className="flex flex-1 justify-center items-center hover:text-white/80 ">
                            <div className="w-[600px] h-24 font-jetBrainsMono">
                                <div className="flex flex-col justify-center items-center my-2">
                                    <div className="text-white">
                                        <p>
                                            All Time Leaderboard Rank (
                                            {duration})
                                        </p>
                                    </div>
                                    <div className="text-white/80 flex flex-row justify-center items-center flex-1 gap-3">
                                        <p className="text-6xl font-bold flex justify-center items-center">
                                            <span className="text-lg">#</span>
                                            {userRank?.highestRank}{' '}
                                            {/* Changed rank to highestRank */}
                                        </p>
                                        <p className="text-xl">
                                            {_user ? (
                                                _user.username
                                            ) : userRank?._id ? (
                                                'user' +
                                                userRank?._id.slice(
                                                    userRank._id.length - 4,
                                                    userRank._id.length
                                                )
                                            ) : (
                                                <></>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlareCard>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}

// Define the data type interface to match what's expected by components
interface WpmScores {
    highestScore10s: number
    highestScore30s: number
    highestScore60s: number
    highestScore120s: number
}

interface DailyWpmScores {
    dailyHighestScore10s: number
    dailyHighestScore30s: number
    dailyHighestScore60s: number
    dailyHighestScore120s: number
}

interface LeaderboardData {
    _id: string
    username: string
    clerkId?: string
    highestWpm: WpmScores
    dailyHighestWpm: DailyWpmScores
}
interface LeaderboardEntry {
    _id: string
    clerkId: string
    username: string
    highestWpm?: {
        highestScore10s?: number
        highestScore30s?: number
        highestScore60s?: number
        highestScore120s?: number
    }
    dailyHighestWpm?: {
        dailyHighestScore10s?: number
        dailyHighestScore30s?: number
        dailyHighestScore60s?: number
        dailyHighestScore120s?: number
    }
}

const DailyLeaderboardContent = ({
    currentPage,
    paginatedDailyLeaderboard,
    ActiveDuration,
    user,
    flag,
    itemsPerPage,
}: {
    currentPage: number
    paginatedDailyLeaderboard: LeaderboardEntry[]
    ActiveDuration: '10s' | '30s' | '60s' | '120s'
    user: any
    flag: boolean
    itemsPerPage: number
}) => {
    return (
        <>
            {currentPage === 1 && (
                <div className="flex flex-row h-80 mb-28">
                    {paginatedDailyLeaderboard.slice(0, 3).map((data, index) => (
                            <DynamicStage
                                flag={flag}
                                duration={ActiveDuration}
                                data={data}
                                key={`daily-top-${data._id}-${index}`}
                                index={index + 1}
                            />
                        ))}
                </div>
            )}
            <div className="bg-white rounded-lg">
                {paginatedDailyLeaderboard.slice(3).map((data, index) => (
                    <DynamicDailyLeaderboardComponent
                        duration={ActiveDuration}
                        user={user}
                        data={data}
                        index={index + 3}
                        key={`daily-board-${data._id}-${index}`}
                    />
                ))}
            </div>
        </>
    )
}

const LeaderboardContent = ({
    currentPage,
    paginatedLeaderboard,
    ActiveDuration,
    user,
    flag,
    itemsPerPage,
}: {
    currentPage: number
    paginatedLeaderboard: LeaderboardData[]
    ActiveDuration: '10s' | '30s' | '60s' | '120s'
    user: any
    flag: boolean
    itemsPerPage: number
}) => {
    return (
        <>
            {currentPage === 1 && (
                <div className="flex flex-row h-80 mb-28">
                    {paginatedLeaderboard.slice(0, 3).map((data, index) => (
                        <DynamicStage
                            data={data}
                            flag={true}
                            duration={ActiveDuration}
                            key={`top-${data._id}-${index}`}
                            index={index + 1}
                        />
                    ))}
                </div>
            )}
            <div className="bg-white rounded-lg">
                {paginatedLeaderboard.slice(3).map((data, index) => (
                    <DynamicLeaderBoardComponent
                        duration={ActiveDuration}
                        user={user}
                        data={data}
                        index={index + 3}
                        flag={flag}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        key={`board-${data._id}-${index}`}
                    />
                ))}
            </div>
        </>
    )
}
const LeaderBoard = () => {
    const [ActiveDuration, setActiveDuration] = useState<
        '10s' | '30s' | '60s' | '120s'
    >('10s')
    const { leaderboard, dailyLeaderboard, duration, changeDuration } =
        useLeaderboard({ duration: ActiveDuration, setActiveDuration })

    const [currentPage, setCurrentPage] = useState(1)
    const [flag, setFlag] = useState(true)
    const itemsPerPage = 50
    const { user } = useUser()

    // Reset to page 1 when changing duration or leaderboard type
    useEffect(() => {
        setCurrentPage(1)
    }, [duration, flag])

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1)
    }

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    }

    const handleDurationChange = (
        newDuration: '10s' | '30s' | '60s' | '120s'
    ) => {
        changeDuration(newDuration)
    }

    // Process leaderboard data for consistency
    const processedLeaderboard = useMemo(() => {
        return leaderboard.map((entry) => ({
            username: entry.username,
            clerkId: entry.clerkId,
            _id: entry._id,
            highestWpm: {
                highestScore10s: entry.highestWpm?.highestScore10s || 0,
                highestScore30s: entry.highestWpm?.highestScore30s || 0,
                highestScore60s: entry.highestWpm?.highestScore60s || 0,
                highestScore120s: entry.highestWpm?.highestScore120s || 0,
            },
            dailyHighestWpm: {
                dailyHighestScore10s:
                    entry.dailyHighestWpm?.dailyHighestScore10s || 0,
                dailyHighestScore30s:
                    entry.dailyHighestWpm?.dailyHighestScore30s || 0,
                dailyHighestScore60s:
                    entry.dailyHighestWpm?.dailyHighestScore60s || 0,
                dailyHighestScore120s:
                    entry.dailyHighestWpm?.dailyHighestScore120s || 0,
            },
        }))
    }, [leaderboard])

    // Calculate paginated data
    const paginatedLeaderboard = useMemo(() => {
        return processedLeaderboard.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
    }, [processedLeaderboard, currentPage, itemsPerPage])

    const paginatedDailyLeaderboard = useMemo(() => {
        return dailyLeaderboard.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
    }, [dailyLeaderboard, currentPage, itemsPerPage])

    return (
        <div className="flex flex-1 flex-col justify-center items-center w-full">
            <LeaderboardButton flag={flag} setFlag={setFlag} />

            {/* Duration Selector */}
            <DurationSelector
                activeDuration={ActiveDuration}
                onDurationChange={handleDurationChange}
            />

            {flag ? (
                <>
                    <LeaderboardContent
                        currentPage={currentPage}
                        paginatedLeaderboard={paginatedLeaderboard}
                        ActiveDuration={ActiveDuration}
                        user={user}
                        flag={flag}
                        itemsPerPage={itemsPerPage}
                    />
                </>
            ) : (
                <>
                    <DailyLeaderboardContent
                        currentPage={currentPage}
                        paginatedDailyLeaderboard={paginatedDailyLeaderboard}
                        ActiveDuration={ActiveDuration}
                        user={user}
                        flag={flag}
                        itemsPerPage={itemsPerPage} />
                </>
            )}

            <div className="flex w-full max-w-[452px] justify-between items-center mt-4 font-jetBrainsMono">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center rounded-full px-4 py-2 bg-gray-400 disabled:opacity-50"
                >
                    <ArrowLeft />
                    <p> Previous</p>
                </button>
                <p>{currentPage}</p>
                <button
                    onClick={handleNextPage}
                    disabled={
                        flag
                            ? currentPage * itemsPerPage >= leaderboard.length
                            : currentPage * itemsPerPage >=
                              dailyLeaderboard.length
                    }
                    className="flex items-center rounded-full px-4 py-2 bg-gray-400 disabled:opacity-50"
                >
                    <p>Next</p>
                    <ArrowRight />
                </button>
            </div>
        </div>
    )
}

export default LeaderBoard
