import { updateHeatmap } from '@/lib/actions/heatmap/increament.actions'
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
    const _updateHeatMap = async (clerkId: string) => {
        const currentDate = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

        // const response = await fetch(`/api/user/update-heatmap?clerkId=${clerkId}&date=${currentDate}`, {
        //     method: 'GET',
        //     headers: { 'Content-Type': 'application/json' }
        // })
        updateHeatmap(clerkId, currentDate)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err.error)
            })
    }
    useEffect(() => {
        if (gameOver && user?.id) {
            getUserIdByClerkId(user?.id || '').then(async () => {
                if (user && wpm) {
                    await addNewScore(user.id, wpm, 0, timerOptions)
                }
            })
            _updateHeatMap(user.id)
            addRecentWpmScore(user.id, wpm, timerOptions)
        }
    }, [gameOver, user, timerOptions])
}

export default useAddNewScore
