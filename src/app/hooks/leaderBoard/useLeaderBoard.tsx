import {
    GetDailyLeaderboard,
    getDailyLeaderboard,
    GetLeaderboard,
    getLeaderboard,
    GetUserRank,
    getUserRank,
} from '@/lib/actions/score.actions'
import { useCallback, useEffect, useState } from 'react'

interface UserRank {
    _id: string
    clerkId: string
    highestWpm: number
    dailyHighestWpm: number
    highestRank: number
    dailyRank: number
}

interface LeaderboardEntry {
    _id: string
    clerkId: string
    username: string
    highestWpm?: {
        highestScore10s?: number
        highestScore30s?: number
        highestScore60s?: number
        highestScore120s?: number
    }
    dailyHighestWpm?: {
        dailyHighestScore10s?: number
        dailyHighestScore30s?: number
        dailyHighestScore60s?: number
        dailyHighestScore120s?: number
    }
}

function swapFirstTwoElements<T>(array: T[]): T[] {
    if (!Array.isArray(array) || array.length < 2) {
        return array
    }
    const temp = array[0]
    array[0] = array[1]
    array[1] = temp
    return array
}

export const useLeaderboard = ({
    duration = '10s',
    setActiveDuration = undefined,
}: {
    duration?: '10s' | '30s' | '60s' | '120s'
    setActiveDuration?: React.Dispatch<
        React.SetStateAction<'10s' | '30s' | '60s' | '120s'>
    >
}) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [dailyLeaderboard, setDailyLeaderboard] = useState<
        LeaderboardEntry[]
    >([])
    const [userRank, setUserRank] = useState<UserRank | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const fetchLeaderboards = useCallback(
        async (timeDuration = duration) => {
            setLoading(true)
            try {
                const [leaderboardRes,dailyLeaderboardRes] = await Promise.all([
                    GetLeaderboard(timeDuration),
                    GetDailyLeaderboard(timeDuration),
                ])
                setLeaderboard(swapFirstTwoElements([...leaderboardRes]))
                setDailyLeaderboard(swapFirstTwoElements([...dailyLeaderboardRes]))
            } catch (error) {
                console.error('Error fetching leaderboards:', error)
            } finally {
                setLoading(false)
            }
        },
        [duration]
    )

    const getRank = useCallback(
        async (userId: string, timeDuration = duration) => {
            try {
                const res = await GetUserRank(userId, timeDuration)
                setUserRank(res || undefined)
                return res
            } catch (error) {
                console.error('Error fetching user rank:', error)
                return undefined
            }
        },
        [duration]
    )

    // Change duration and refetch data
    const changeDuration = useCallback(
        (newDuration: '10s' | '30s' | '60s' | '120s') => {
            fetchLeaderboards(newDuration).then(() => {
                console.log('fetched')
                if (setActiveDuration) {
                    setActiveDuration(newDuration)
                }
            })
        },
        [fetchLeaderboards, setActiveDuration]
    )

    useEffect(() => {
        fetchLeaderboards()
    }, [])

    return {
        leaderboard,
        dailyLeaderboard,
        getRank,
        userRank,
        loading,
        changeDuration,
        duration,
    }
}
