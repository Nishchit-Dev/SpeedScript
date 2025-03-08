import { getBadgeImage } from '@/components/BadgeComponent'
import { GlareCard } from '@/components/ui/glare-ui'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface finalRoomState {
    players: {
        username: string
        stats: {
            time: number
            wpm: number
        }[]
        wpm: number
        rank: number
        finishTime: number
        roomId: string
    }[]
    roomId: string
}

const getUserRank = (username: string, data: finalRoomState) => {
    const player = data.players.find((player) => player.username === username) 
    const sorted = data.players.sort((a, b) => b.wpm - a.wpm)
    const rank = sorted.findIndex((p) => p.username === username) + 1
    return { rank: player ? rank : 0, username: username }
}

const UserScoreDisplay = ({
    wpm,
    gameState,
    data,
}: {
    wpm: number
    gameState: string
    data: finalRoomState
}) => {
    const [userData, setRank] = useState({ rank: 0, username: '' })
    const { user } = useUser()
    useEffect(() => {
        if (gameState === 'finished' && user?.username) {
            let _data = getUserRank(user?.username, data)
            setRank(_data)
        }
    }, [data])

    return (
        <>
            <div className='flex flex-col items-center'>
                <GlareCard className="flex flex-1 justify-center items-center hover:text-white/80 ">
                    <div className="w-[600px] h-24 font-jetBrainsMono">
                        <div className="flex flex-col justify-center items-center my-2">
                            <div className="text-white">
                                <p>LeaderBoard of Room</p>
                            </div>
                            <div className="text-white/80 flex flex-row justify-center items-center flex-1 gap-3">
                                <p className="text-6xl font-bold flex justify-center items-center">
                                    <span className="text-lg">#</span>
                                    {userData.rank}
                                </p>
                                <p className="text-xl">{userData.username}</p>
                            </div>
                        </div>
                    </div>
                </GlareCard>
                <div>
                    <Image
                        src={`/throphies/badges/${getBadgeImage(
                            Math.round(Number(wpm))
                        )}`}
                        alt=""
                        width={180}
                        height={180}
                    />
                </div>
            </div>
        </>
    )
}

export default UserScoreDisplay