import { addNewScore, addRecentWpmScore } from '@/lib/actions/score.actions'
import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { UserResource } from '@clerk/types'
import { useEffect } from 'react'

const useAddNewScore = (
    gameOver: boolean,
    wpm: number,
    user: UserResource | null,
    timerOptions: number
) => {
    const updateHeatMap = async (clerkId: string) => {
        const currentDate = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

        const response = await fetch('/api/user/update-heatmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clerkId, date: currentDate }),
        })

        const result = await response.json()

        if (!result.success) {
            console.error('Failed to update heatmap:', result.error)
        }
    }
    useEffect(() => {
        if (gameOver && user) {
            getUserIdByClerkId(user?.id || '').then(async () => {
                if (user && wpm) {
                    await addNewScore(user.id, wpm, 0, timerOptions)
                }
            })
            updateHeatMap(user.id)
            addRecentWpmScore(user.id, wpm, timerOptions)
        }
    }, [gameOver, user, timerOptions])
}

export default useAddNewScore
