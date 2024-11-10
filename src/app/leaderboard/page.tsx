'use client'
import clsx from 'clsx'
import { useLeaderboard } from '../hooks/leaderBoard/useLeaderBoard'
import Counter from '@/components/ui/countingNumberAnimation'
import { User } from 'lucide-react'

interface data {
    username: string
    highestWpm: number
}
const LeaderboardComponent = ({
    index,
    data,
}: {
    index: number
    data: data
}) => {
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
                { 'bg-yellow-200 p-3 px-10 min-w-[412px] text-lg': index == 2 },
                { 'bg-yellow-100 p-3 px-10 min-w-[412px]': index > 2 },
                { 'hidden': data.highestWpm <= 0 }
            )}
        >
            <div className="flex flex-1 justify-between items-center font-jetBrainsMono ">
                <div className="flex justify-center items-center gap-5">
                    <div className="">{index + 1}</div>
                    <div className='bg-white/60 rounded-full p-1'><User/></div>
                    <div className="">{data.username || ' guest '}</div>
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

const LeaderBoard = () => {
    const { leaderboard } = useLeaderboard()
    return (
        <div className="flex flex-1 flex-col justify-center items-center w-full">
            {leaderboard.map((data, index) => {
                return (
                    <div key={index}>
                        <LeaderboardComponent data={data} index={index} />
                    </div>
                )
            })}
        </div>
    )
}

export default LeaderBoard
