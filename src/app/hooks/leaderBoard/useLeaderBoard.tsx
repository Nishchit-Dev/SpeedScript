import {
    getDailyLeaderboard,
    getLeaderboard,
    getUserRank,
} from '@/lib/actions/score.actions'
import { useCallback, useEffect, useState } from 'react'

interface UserRank {
    _id: string
    clerkId: string
    __v: number
    dailyHighestWpm: number
    highestWpm: number
    rank: number
}
function swapFirstTwoElements(array: any[]): any[] {
    if (!Array.isArray(array) || array.length < 2) {
        return array // Return the array as is if it's not valid
    }

    // Swap the first two elements
    const temp = array[0]
    array[0] = array[1]
    array[1] = temp

    return array // Return the updated array
}

export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<UserRank[]>([])
    const [dailyLeaderboard, setDailyLeaderboard] = useState<UserRank[]>([])
    const [userRank, setUserRank] = useState<UserRank | undefined>(undefined)

    const fetchLeaderboards = useCallback(async () => {
        const [leaderboardRes, dailyLeaderboardRes] = await Promise.all([
            getLeaderboard(),
            getDailyLeaderboard(),
        ])
        setLeaderboard(swapFirstTwoElements(leaderboardRes))
        setDailyLeaderboard(swapFirstTwoElements(dailyLeaderboardRes))
    }, [])

    const getRank = useCallback(async (userId: string) => {
        const res = await getUserRank(userId)
        setUserRank(res)
    }, [])

    useEffect(() => {
        fetchLeaderboards()
    }, [fetchLeaderboards])

    return { leaderboard, dailyLeaderboard, getRank, userRank }
}
