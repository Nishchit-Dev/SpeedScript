import { addNewScore } from '@/lib/actions/score.actions'
import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { UserResource } from '@clerk/types'
import { useEffect } from 'react'

const useAddNewScore = (gameOver: boolean, wpm: number, user: UserResource | null) => {
    useEffect(() => {
        if (gameOver && user) {
            getUserIdByClerkId(user?.id || '').then(async () => {
                if (user && wpm) {
                    await addNewScore(user.id, wpm, 0)
                }
            })
        }
    }, [gameOver, user])
}

export default useAddNewScore
