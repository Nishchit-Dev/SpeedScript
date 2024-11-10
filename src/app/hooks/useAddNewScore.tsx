import { addNewScore } from '@/lib/actions/score.actions'
import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

const useAddNewScore = (gameOver: boolean, wpm: number) => {
    const { user } = useUser()

    useEffect(() => {
        if (gameOver && user) {
            getUserIdByClerkId(user?.id || '').then(async () => {
                if (user && wpm) {
                    await addNewScore(user.id, wpm, 0)
                }
            })
        }
    }, [gameOver, user?.id])
}

export default useAddNewScore
