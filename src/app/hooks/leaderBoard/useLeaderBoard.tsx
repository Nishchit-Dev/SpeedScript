import { getLeaderboard } from '@/lib/actions/score.actions'
import { useEffect, useState } from 'react'

export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        getLeaderboard().then((res) => {
            setLeaderboard(res)
        })
    }, [])

    return { leaderboard }
}
