import { getBadgeImage } from '@/components/BadgeComponent'
import { ArrowBottomLeftIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const DynamicLeaderBoardComponent = ({
    index,
    data,
    currentPage,
    itemsPerPage,
    duration,
    user,
}: {
    user: any
    index: number
    data: any
    flag?: boolean
    currentPage: number
    itemsPerPage: number
    duration: string
}) => {
    const [component, setComponent] = useState<React.ReactNode>(null)
   
    useEffect(() => {
        setComponent(null)
        renderComponentForDuration(duration)
    }, [duration])

    const usernameSlicer = (userData: any) => {
        // Keeping this function reference as it was in the original code
        return userData.username || 'User' // Placeholder implementation
    }

    const renderComponentForDuration = (duration: string) => {
        // Get the appropriate score property based on duration
        const scoreProp = `highestScore${duration}`

        const score = data.highestWpm[scoreProp]

        // Skip rendering if score is invalid
        // if (score <= 0 || !score) return

        const position = (currentPage - 1) * itemsPerPage + index + 1
        const isTopThree = position < 3

        // Determine background color based on rank
        let bgColorClass = 'p-3 px-10 min-w-[452px]'

        setComponent(
            <div className={bgColorClass}>
                <div className="flex group flex-1 justify-between items-center font-jetBrainsMono">
                    <div className="flex justify-center items-center gap-2">
                        {isTopThree ? (
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
                        ) : (
                            <div className="flex flex-row justify-center items-center gap-5">
                                <div>{position}</div>
                                <div>
                                    <Image
                                        src={`/throphies/badges/${getBadgeImage(
                                            score
                                        )}`}
                                        alt=""
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="text-black/80" onClick={() => {}}>
                            {usernameSlicer(data)}
                        </div>
                        <div
                            className="rotate-180 cursor-pointer opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all
                                                     duration-300 ease-in-out "
                            onClick={() =>
                                (window.location.href = `/profile/${data.username}`)
                            }
                        >
                            <ArrowBottomLeftIcon />
                        </div>

                        <div
                            className={clsx('', {
                                invisible: user?._id != data._id,
                            })}
                        >
                            <div className="px-3 py-1 bg-white/80 text-black text-xs rounded-full">
                                <p>you</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-bold">{score}</p>
                    </div>
                </div>
            </div>
        )
    }

    return <>{component}</>
}

export default DynamicLeaderBoardComponent
