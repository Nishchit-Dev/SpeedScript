'use client'
import clsx from 'clsx'
import { useLeaderboard } from '../hooks/leaderBoard/useLeaderBoard'
import Counter from '@/components/ui/countingNumberAnimation'
import { ReceiptRussianRuble, User } from 'lucide-react'
import useGuest from '../hooks/cookies/useGuest'
import { useEffect, useState } from 'react'
import { GlareCard } from '@/components/ui/glare-ui'
import useUserCookies from '../hooks/cookies/useUser'

interface data {
    username: string
    clerkId: string
    _id: string
    highestWpm: number
    dailyHighestWpm: number
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
    const { getUser }: { getUser: () => data } = useUserCookies()
    const [user, setUser] = useState<data | null>(null)
    useEffect(() => {
        let userdata = getUser()
        if (userdata) {
            setUser(userdata)
        }
    }, [])

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
                    hidden: data.highestWpm <= 0,
                }
            )}
        >
            <div className="flex flex-1 justify-between items-center font-jetBrainsMono ">
                <div className="flex justify-center items-center gap-5">
                    <div className="">{index + 1}</div>
                    <div className="bg-white/60 rounded-full p-1">
                        <User />
                    </div>
                    <div className="" onClick={() => {}}>
                        {data.username
                            ? data.username
                            : 'user' +
                              data._id.slice(
                                  data._id.length - 4,
                                  data._id.length
                              )}
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
                        number={data.highestWpm > 0 ? data.highestWpm : 0}
                        speed={5}
                    />
                </div>
            </div>
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
    const { getUser }: { getUser: () => data } = useUserCookies()
    const [user, setUser] = useState<data | null>(null)
    useEffect(() => {
        let userdata = getUser()
        if (userdata) {
            setUser(userdata)
        }
    }, [])
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
                    <div className="">{index + 1}</div>
                    <div className="bg-white/60 rounded-full p-1">
                        <User />
                    </div>
                    <div className="" onClick={() => {}}>
                        {data.username
                            ? data.username
                            : 'user' +
                              data._id.slice(
                                  data._id.length - 4,
                                  data._id.length
                              )}
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

const UserScoreBoard = () => {
    const { getRank, userRank } = useLeaderboard()
    const { getUser }: { getUser: () => data } = useUserCookies()
    const [user, setUser] = useState<data | null>(null)

    useEffect(() => {
        setUser(getUser())
    }, [])
    useEffect(() => {
        if (user) {
            getRank(getUser()._id)
        }
    }, [user])
    return (
        <div
            className={clsx(
                'mb-5',
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
                                    {user?.username ? (
                                        user.username
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
    )
}

const LeaderBoard = () => {
    const { leaderboard, dailyLeaderboard } = useLeaderboard()
    const [flag, setFlag] = useState(true)

    return (
        <div className="flex flex-1 flex-col justify-center items-center w-full">
            <LeaderboardButton flag={flag} setFlag={setFlag} />
            <UserScoreBoard />
            {flag
                ? leaderboard.map((data: any, index) => {
                      return (
                          <div key={index}>
                              <LeaderboardComponent
                                  data={data}
                                  index={index}
                                  flag={!flag}
                              />
                          </div>
                      )
                  })
                : dailyLeaderboard.map((data: any, index) => {
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
    )
}

export default LeaderBoard
