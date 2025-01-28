'use client'
import { clsx } from 'clsx'
import { useLeaderboard } from '../hooks/leaderBoard/useLeaderBoard'
import Counter from '@/components/ui/countingNumberAnimation'
import { ReceiptRussianRuble, User } from 'lucide-react'
import useUserLocal from '../hooks/cookies/useGuest'
import { useEffect, useState } from 'react'
import { GlareCard } from '@/components/ui/glare-ui'
import useUserCookies from '../hooks/cookies/useUser'
import Image from 'next/image'
import { RankingStage } from '../room/_ranks/rankUsers'
import React from 'react'
import { Data } from './rankUsers'
import { getBadgeImage } from '@/components/BadgeComponent'

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

export const Stage = ({
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
}: {
    index: number
    data: data
    flag?: boolean
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
                                    <div>{index + 1}</div>
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

                            <div className="" onClick={() => {}}>
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
                            <Counter
                                number={
                                    data.highestWpm > 0 ? data.highestWpm : 0
                                }
                                speed={5}
                            />
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
                { 'bg-yellow-100 p-3 px-10 min-w-[412px]': index > 2 },
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
                    <div className="" onClick={() => {}}>
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
                    <Counter
                        number={
                            data.dailyHighestWpm > 0 ? data.dailyHighestWpm : 0
                        }
                        speed={5}
                    />
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
    const { userGuest, getUser } = useUserLocal()
    const [user, setUser] = useState<data | null>(null)

    useEffect(() => {
        if (user) {
            getRank(getUser().clerkId)
        } else {
            setUser(userGuest)
        }
    }, [userGuest])

    return (
        <>
            {user?.clerkId ? (
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
                                            {getUser()?.username ? (
                                                getUser().username
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

    return (
        <div className="flex flex-1 flex-col justify-center items-center w-full">
            <LeaderboardButton flag={flag} setFlag={setFlag} />
            {<UserScoreBoard flag={flag} />}

            {flag ? (
                <>
                    <div className="flex flex-row h-80 mb-28 ">
                        {leaderboard.map((data: any, index) => {
                            if (index < 3)
                                return (
                                    <Stage
                                        data={data}
                                        flag={true}
                                        key={index + 1}
                                        index={index + 1}
                                    />
                                )
                        })}
                    </div>
                    <div className="bg-white rounded-lg">
                        {leaderboard.map((data: any, index) => {
                            return (
                                <div key={index}>
                                    <LeaderboardComponent
                                        data={data}
                                        index={index}
                                        flag={!flag}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-row h-80 mb-28 ">
                        {
                            <>
                                {dailyLeaderboard.map((data: any, index) => {
                                    if (index < 3)
                                        return (
                                            <Stage
                                                data={data}
                                                key={index + 1}
                                                index={index + 1}
                                            />
                                        )
                                })}
                            </>
                        }
                    </div>
                    <div className="bg-white rounded-lg">
                        {dailyLeaderboard.map((data: any, index) => {
                            if (index > 3)
                                return (
                                    <div key={index}>
                                        <DailyLeaderboardComponent
                                            data={data}
                                            index={index}
                                        />
                                    </div>
                                )
                        })}
                    </div>
                </>
                // dailyLeaderboard.map((data: any, index) => {
                //     return (
                //         <div key={index}>
                //             <DailyLeaderboardComponent
                //                 data={data}
                //                 index={index}
                //             />
                //         </div>
                //     )
                // })
            )}
        </div>
    )
}

export default LeaderBoard
