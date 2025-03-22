import clsx from "clsx"
import { User } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

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

const usernameSlicer = (data: data) => {
    return data.username
        ? data.username
        : 'user' + data._id.slice(data._id.length - 4, data._id.length)
}

const DynamicStage = ({
    data,
    index,
    flag,
    duration,
}: {
    data: any
    index: number
    flag: boolean
    duration: string
}) => {
    const scoreKey = flag
        ? `highestScore${duration}`
        : `dailyHighestScore${duration}`
    const [component, setComponent] = useState<React.ReactNode>(null)

    useEffect(() => {
        setComponent(
            <div className="p-2 h-80">
                <div
                    className={clsx(
                        'relative items-center flex flex-col',
                        { 'top-[0%]': index === 2 },
                        { 'top-[30%]': index === 1 },
                        { 'top-[45%]': index === 3 }
                    )}
                >
                    <Image
                        src={`/throphies/LeaderboardRank${index}.svg`}
                        alt=""
                        width={180}
                        height={180}
                    />
                    <div className="font-jetBrainsMono font-bold text-2xl">
                        <p>
                            {
                                data[flag ? 'highestWpm' : 'dailyHighestWpm'][
                                    scoreKey
                                ]
                            }
                        </p>
                    </div>
                    <div className="flex flex-row gap-2 font-jetBrainsMono bg-white/80 px-3 py-2 rounded-full justify-center items-center">
                        <div className="bg-slate-400 rounded-full p-[2px]">
                            <User />
                        </div>
                        <p>{usernameSlicer(data)}</p>
                    </div>
                </div>
            </div>
        )
    }, [data, index, flag, duration])

    return <>{component}</>
}

export default DynamicStage