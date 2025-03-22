import { getBadgeImage } from "@/components/BadgeComponent";
import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";

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
        console.log('scoreProp', scoreProp)
        const score = data.highestWpm[scoreProp]
        console.log('score', score)

        // Skip rendering if score is invalid
        // if (score <= 0 || !score) return

        const isTopThree = index < 3
        const position = (currentPage - 1) * itemsPerPage + index + 1

        // Determine background color based on rank
        let bgColorClass = ''
        if (index === 0)
            bgColorClass = 'bg-yellow-400 p-3 px-10 min-w-[612px] text-2xl'
        else if (index === 1)
            bgColorClass = 'bg-yellow-300 p-3 px-10 min-w-[562px] text-xl'
        else if (index === 2)
            bgColorClass = 'bg-yellow-200 p-3 px-10 min-w-[512px] text-lg'
        else bgColorClass = 'p-3 px-10 min-w-[452px]'

        setComponent(
            <div className={bgColorClass}>
                <div className="flex flex-1 justify-between items-center font-jetBrainsMono">
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