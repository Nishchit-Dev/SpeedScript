import {
    getDailyLeaderboard,
    getLeaderboard,
    getUserRank,
} from '@/lib/actions/score.actions'
import { useEffect, useState } from 'react'

interface UserRank {
    _id: string
    clerkId: string
    __v: number
    dailyHighestWpm: number
    highestWpm: number
    rank: number
}

export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<UserRank[]>([])
    const [dailyLeaderboard, setDailyLeaderboard] = useState<UserRank[]>([])
    const [userRank, setUserRank] = useState<UserRank | undefined>(undefined)

    const getRank = async (userId?: string) => {
        await getUserRank(userId).then((res) => {
            console.log(res)
            setUserRank(res)
        })
    }
    useEffect(() => {
        getLeaderboard().then((res) => {
            setLeaderboard(res)
        })
        getDailyLeaderboard().then((res) => {
            setDailyLeaderboard(res)
        })
    }, [])

    return { leaderboard, dailyLeaderboard, getRank, userRank }
}
