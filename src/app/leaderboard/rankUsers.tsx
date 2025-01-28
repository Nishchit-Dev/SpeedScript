import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { User } from 'lucide-react'

export interface Data {
    username: string
    clerkId: string
    _id: string
    highestWpm: number
    dailyHighestWpm: number
    rank:number
}
const recalculateRanks = (data: Data[]) => {
    // Sort by WPM in descending order and assign new ranks
    return data
        .sort((a, b) => b.highestWpm - a.highestWpm) // Sort by WPM descending
        .map((user, index) => ({ ...user, rank: index + 1 })) // Assign new ranks
}

const customSortForTopRanks = (data: Data[]) => {
    // Recalculate ranks based on WPM
    const recalculatedData = recalculateRanks(data)

    // Create an order for ranks: 2 (left), 1 (center), 3 (right)
    const order: any = { 2: 0, 1: 1, 3: 2 }

    // Filter and sort for ranks 1, 2, and 3 in the desired order
    return recalculatedData
        .filter((user) => user.rank === 1 || user.rank === 2 || user.rank === 3)
        .sort((a, b) => order[a.rank] - order[b.rank])
}


const Stage = ({ data, index }: { data: Data; index: number }) => {
    return (
        <div className="p-2 h-72">
            <div
                className={clsx(
                    'relative  items-center flex flex-col',
                    { ' top-[30%]': data.rank == 2 },
                    { 'top-[0%]': data.rank == 1 },
                    { ' top-[45%]': data.rank == 3 }
                )}
            >
                <div>
                    <Image
                        src={`/throphies/rank${data.rank}.svg`}
                        alt=""
                        width={150}
                        height={150}
                    />
                </div>
                <div className="font-jetBrainsMono font-bold text-2xl ">
                    <p> {data.highestWpm}</p>
                </div>
                <div className="flex flex-row gap-2 font-jetBrainsMono bg-white/80 px-3 py-2 rounded-full justify-center items-center">
                    <div className="bg-slate-400 rounded-full p-[2px]">
                        <User />
                    </div>
                    <p> {data.username}</p>
                </div>
            </div>
        </div>
    )
}

export const RankingStage = ({ data }: { data: Data[] }) => {
    const RankedUser = customSortForTopRanks(data)
    return (
        <div className="">
            <div className=" rounded-xl justify-center align-middle items-center">
                <div className="flex flex-row">
                    {RankedUser.map((eachUser: Data, i: number) => {
                        if (i < 3)
                            return (
                                <Stage data={eachUser} index={i + 1} key={i} />
                            )
                    })}
                </div>
            </div>
        </div>
    )
}
