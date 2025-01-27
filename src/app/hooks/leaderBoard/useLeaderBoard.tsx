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
function swapFirstTwoElements(array: any[]): any[] {
    if (!Array.isArray(array) || array.length < 2) {
        return array // Return the array as is if it's not valid
    }

    // Swap the first two elements
    const temp = array[0]
    array[0] = array[1]
    array[1] = temp

    console.log(array)
    return array // Return the updated array
}

export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<UserRank[]>([])
    const [dailyLeaderboard, setDailyLeaderboard] = useState<UserRank[]>([])
    const [userRank, setUserRank] = useState<UserRank | undefined>(undefined)

    const getRank = async (userId: string) => {
        await getUserRank(userId).then((res) => {
            setUserRank(res)
        })
    }
    useEffect(() => {
        getLeaderboard().then((res) => {
            setLeaderboard(swapFirstTwoElements(res))
        })
        getDailyLeaderboard().then((res) => {
            setDailyLeaderboard(swapFirstTwoElements(res))
        })
    }, [])

    return { leaderboard, dailyLeaderboard, getRank, userRank }
}
