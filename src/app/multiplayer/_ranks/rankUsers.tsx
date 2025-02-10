import clsx from 'clsx'
import { User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    data: any[]
}

export type Data = {
    finishTime: number
    rank: number
    roomId: number
    stats: any[]
    username: string
    wpm: number
}

const sortByRank = (data: Data[]) => {
    return data.sort((a, b) => b.wpm - a.wpm)
}

const EachUserRank = ({ data, index }: { data: Data; index: number }) => {
    return (
        <div key={index}>
            <div className="flex flex-row  items-center ">
                <p className="font-jetBrainsMono text-black/60 text-lg mr-2">
                    {index + 1}
                </p>
                <Image
                    src={`/throphies/rank${index + 1}.svg`}
                    alt={`Rank ${index + 1}`}
                    width={60}
                    height={60}
                />
                <p className="font-jetBrainsMono text-lg text-black/60 ml-3">
                    {data.username}
                </p>
                <p className="font-jetBrainsMono text-lg ml-4">{data.wpm}</p>
            </div>
        </div>
    )
}

const RankUsers = ({ data }: { data: Data[] }) => {
    const RankedUser = sortByRank(data)
    return (
        <div>
            <div className="bg-white  p-5 rounded-xl justify-center align-middle items-center">
                <div className="text-lg font-jetBrainsMono align-middle">
                    <p className="text-center">Ranks</p>
                </div>
                {RankedUser.map((eachUser: Data, i: number) => {
                    return <EachUserRank data={eachUser} index={i} key={i} />
                })}
            </div>
        </div>
    )
}

export const Stage = ({ data, index }: { data: Data; index: number }) => {
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
                    <p> {data.wpm}</p>
                </div>
                <div className="flex flex-row gap-2 font-jetBrainsMono bg-white/80 px-2 pr-3 py-2 rounded-full justify-center items-center">
                    <div className="text-yellow-400   font-bold rounded-full p-[2px] px-[5px]">
                        {/* <User /> */}
                        <p>#{index == 1 ? 2 : index == 2 ? 1 : index}</p>
                    </div>
                    <p> {data.username}</p>
                </div>
            </div>
        </div>
    )
}
const recalculateRanks = (data: Data[]) => {
    // Sort by WPM in descending order and assign new ranks
    return data
        .sort((a, b) => b.wpm - a.wpm) // Sort by WPM descending
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

export default RankUsers
