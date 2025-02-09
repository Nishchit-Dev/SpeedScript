'use client'
import { clsx } from 'clsx'
import { useLeaderboard } from '../hooks/leaderBoard/useLeaderBoard'
import Counter from '@/components/ui/countingNumberAnimation'
import {
    ArrowBigRight,
    ArrowLeft,
    ArrowLeftCircle,
    ArrowRight,
    User,
} from 'lucide-react'
import useUserLocal from '../hooks/cookies/useGuest'
import { useEffect, useState } from 'react'
import { GlareCard } from '@/components/ui/glare-ui'
import Image from 'next/image'
import React from 'react'
import { getBadgeImage } from '@/components/BadgeComponent'
import { useUser } from '@clerk/nextjs'
import { set } from 'mongoose'

interface data {
    username: string
    clerkId: string
    _id: string
    highestWpm: number
    dailyHighestWpm: number
}

const usernameSlicer = (data: data) => {
    return data.username
        ? data.username
        : 'user' + data._id.slice(data._id.length - 4, data._id.length)
}

const Stage = ({
    data,
    index,
    flag,
}: {
    data: data
    index: number
    flag?: boolean
}) => {
    return (
        <div className="p-2 h-80">
            <div
                className={clsx(
                    'relative  items-center flex flex-col',
                    { ' top-[0%]': index == 2 },
                    { 'top-[30%]': index == 1 },
                    { ' top-[45%]': index == 3 }
                )}
            >
                <div>
                    <Image
                        src={`/throphies/LeaderboardRank${index}.svg`}
                        alt=""
                        width={180}
                        height={180}
                    />
                </div>
                <div className="font-jetBrainsMono font-bold text-2xl ">
                    {flag ? (
                        <p> {data.highestWpm}</p>
                    ) : (
                        <p> {data.dailyHighestWpm}</p>
                    )}
                </div>
                <div className="flex flex-row gap-2 font-jetBrainsMono bg-white/80 px-3 py-2 rounded-full justify-center items-center">
                    <div className="bg-slate-400 rounded-full p-[2px]">
                        <User />
                    </div>
                    <p> {usernameSlicer(data)}</p>
                </div>
            </div>
        </div>
    )
}

const LeaderboardComponent = ({
    index,
    data,
    flag = true,
    currentPage,
    itemsPerPage,
}: {
    index: number
    data: data
    flag?: boolean
    currentPage: number
    itemsPerPage: number
}) => {
    const { userGuest, getUser } = useUserLocal()
    const [user, setUser] = useState<data | null>(null)
    useEffect(() => {
        if (userGuest) {
            setUser(userGuest)
        }
    }, [userGuest])

    return (
        <div className="">
            {index < 3 ? (
                <></>
            ) : (
                <div
                    className={clsx(
                        {
                            'bg-yellow-400 p-3 px-10 min-w-[612px] text-2xl':
                                index == 0,
                        },
                        {
                            'bg-yellow-300 p-3 px-10 min-w-[562px] text-xl':
                                index == 1,
                        },
                        {
                            'bg-yellow-200 p-3 px-10 min-w-[512px] text-lg':
                                index == 2,
                        },
                        { ' p-3 px-10 min-w-[452px]': index > 2 },
                        {
                            hidden: data.highestWpm <= 0,
                        }
                    )}
                >
                    <div className="flex flex-1 justify-between items-center font-jetBrainsMono ">
                        <div className="flex justify-center items-center gap-2">
                            {index >= 3 ? (
                                <div className="flex flex-row justify-center items-center gap-5">
                                    <div>
                                        {(currentPage - 1) * itemsPerPage +
                                            index +
                                            1}
                                    </div>
                                    <div>
                                        <Image
                                            src={`/throphies/badges/${getBadgeImage(
                                                data.highestWpm
                                            )}`}
                                            alt=""
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-full">
                                    <Image
                                        src={`/throphies/LeaderboardRank${
                                            index + 1
                                        }.svg`}
                                        alt=""
                                        height={60}
                                        width={60}
                                    />
                                </div>
                            )}

                            <div className="text-black/80" onClick={() => {}}>
                                {usernameSlicer(data)}
                            </div>
                            <div
                                className={clsx('', {
                                    invisible: user?._id != data._id,
                                })}
                            >
                                <div className="px-3 py-1 bg-white/80  text-black text-xs rounded-full">
                                    <p>you</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <p className="text-lg font-bold">
                                {data.highestWpm > 0 ? data.highestWpm : 0}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const DailyLeaderboardComponent = ({
    index,
    data,
}: {
    index: number
    data: data
}) => {
    const { userGuest, getUser } = useUserLocal()
    const [user, setUser] = useState<data | null>(null)
    useEffect(() => {
        if (userGuest) {
            setUser(userGuest)
        }
    }, [userGuest])
    return (
        <div
            className={clsx(
                {
                    'bg-yellow-400 p-3 px-10 min-w-[512px] text-2xl':
                        index == 0,
                },
                {
                    'bg-yellow-300 p-3 px-10 min-w-[462px] text-xl': index == 1,
                },
                {
                    'bg-yellow-200 p-3 px-10 min-w-[412px] text-lg': index == 2,
                },
                { ' p-3 px-10 min-w-[412px]': index > 2 },
                {
                    hidden: data.dailyHighestWpm <= 0,
                }
            )}
        >
            <div className="flex flex-1 justify-between items-center font-jetBrainsMono ">
                <div className="flex justify-center items-center gap-5">
                    {index >= 3 ? (
                        <div className="flex flex-row justify-center items-center gap-5">
                            <div>{index + 1}</div>
                            <div>
                                <Image
                                    src={`/throphies/badges/${getBadgeImage(
                                        data.dailyHighestWpm
                                    )}`}
                                    alt=""
                                    width={50}
                                    height={50}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-full">
                            <Image
                                src={`/throphies/LeaderboardRank${
                                    index + 1
                                }.svg`}
                                alt=""
                                height={60}
                                width={60}
                            />
                        </div>
                    )}
                    <div className="text-black/80" onClick={() => {}}>
                        {usernameSlicer(data)}
                    </div>
                    <div
                        className={clsx('', {
                            invisible: user?._id != data._id,
                        })}
                    >
                        <div className="px-3 py-1 bg-white/80  text-black text-xs rounded-full">
                            <p>you</p>
                        </div>
                    </div>
                </div>
                <div className="font-jetBrainsMono">
                    <p className="text-lg font-bold">
                        {' '}
                        {data.dailyHighestWpm > 0
                            ? data.dailyHighestWpm
                            : 0}{' '}
                    </p>
                </div>
            </div>
        </div>
    )
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
            <div className="bg-black/70 flex flex-row rounded-full p-1 text-black/70 font-jetBrainsMono mb-5 gap-2">
                <div
                    className={clsx(
                        ' px-5 py-2 rounded-full cursor-pointer',
                        { 'bg-yellow-300 text-black': flag },
                        { 'text-white/70': !flag }
                    )}
                    onClick={() => setFlag(!flag)}
                >
                    <p>All Time</p>
                </div>
                <div
                    onClick={() => setFlag(!flag)}
                    className={clsx(
                        ' px-5 py-2 rounded-full text-black cursor-pointer',
                        { 'bg-yellow-300': !flag },
                        { 'text-white/70': flag }
                    )}
                >
                    <p>Daily</p>
                </div>
            </div>
        </>
    )
}

const UserScoreBoard = ({ flag }: { flag: boolean }) => {
    const { getRank, userRank } = useLeaderboard()
    const { user } = useUser()
    const [_user, setUser] = useState<data | null>(null)

    useEffect(() => {
        if (user) {
            getRank(user.id)
            if (user?.username) {
                setUser((prev: any) => {
                    return { ...prev, username: user.username || null }
                })
            }
        }
    }, [user?.username])

    return (
        <>
            {user?.username ? (
                <div
                    className={clsx(
                        'mb-5',
                        { hidden: !flag },
                        { visible: userRank?.rank != -1 },
                        { hidden: userRank?.rank == -1 }
                    )}
                >
                    <div>
                        <GlareCard className="flex flex-1 justify-center items-center hover:text-white/80 ">
                            <div className="w-[600px] h-24 font-jetBrainsMono">
                                <div className="flex flex-col justify-center items-center my-2">
                                    <div className="text-white">
                                        <p>All Time Leaderboard Rank</p>
                                    </div>
                                    <div className="text-white/80 flex flex-row justify-center items-center flex-1 gap-3">
                                        <p className="text-6xl font-bold flex justify-center items-center">
                                            <span className="text-lg">#</span>
                                            {userRank?.rank}
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
const LeaderBoard = () => {
    const { leaderboard, dailyLeaderboard } = useLeaderboard()
    const [flag, setFlag] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 50

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1)
    }

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    }

    const paginatedLeaderboard = leaderboard.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const paginatedDailyLeaderboard = dailyLeaderboard.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="flex flex-1 flex-col justify-center items-center w-full">
            <LeaderboardButton flag={flag} setFlag={setFlag} />
            {<UserScoreBoard flag={flag} />}

            {flag ? (
                <>
                    {currentPage === 1 && (
                        <div className="flex flex-row h-80 mb-28 ">
                            {paginatedLeaderboard.map((data: any, index) => {
                                if (index < 3)
                                    return (
                                        <Stage
                                            data={data}
                                            flag={true}
                                            key={
                                                (currentPage - 1) *
                                                    itemsPerPage +
                                                index +
                                                1
                                            }
                                            index={
                                                (currentPage - 1) *
                                                    itemsPerPage +
                                                index +
                                                1
                                            }
                                        />
                                    )
                            })}
                        </div>
                    )}
                    <div className="bg-white rounded-lg">
                        {paginatedLeaderboard.map((data: any, index) => {
                            if (index >= 3)
                                return (
                                    <LeaderboardComponent
                                        data={data}
                                        index={index}
                                        flag={flag}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                        key={
                                            (currentPage - 1) * itemsPerPage +
                                            index +
                                            1
                                        }
                                    />
                                )
                        })}
                    </div>
                </>
            ) : (
                <>
                    {currentPage === 1 && (
                        <div className="flex flex-row h-80 mb-28 ">
                            {paginatedDailyLeaderboard.map(
                                (data: any, index) => {
                                    if (index < 3)
                                        return (
                                            <Stage
                                                data={data}
                                                key={index + 1}
                                                index={index + 1}
                                            />
                                        )
                                }
                            )}
                        </div>
                    )}
                    <div className="bg-white rounded-lg">
                        {paginatedDailyLeaderboard.map((data: any, index) => {
                            if (index >= 3)
                                return (
                                    <DailyLeaderboardComponent
                                        data={data}
                                        index={index}
                                        key={index}
                                    />
                                )
                        })}
                    </div>
                </>
            )}
            <div className="flex w-full max-w-[452px] justify-between items-center mt-4 font-jetBrainsMono">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center  rounded-full px-4 py-2 bg-gray-400 disabled:opacity-50"
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
