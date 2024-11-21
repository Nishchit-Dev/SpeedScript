import { addNewScore, addNewScoreById } from '@/lib/actions/score.actions'
import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import useGuest from './cookies/useGuest'

const useAddNewScore = (gameOver: boolean, wpm: number) => {
    const { user } = useUser()
    const { userGuest, getUser } = useGuest()
    useEffect(() => {
        if (gameOver && user) {
            getUserIdByClerkId(user?.id || '').then(async () => {
                if (user && wpm) {
                    await addNewScore(user.id, wpm, 0)
                }
            })
        } else if (userGuest) {
            ;(async () => {
                await addNewScoreById(userGuest, wpm, 0).then((res) => {})
            })()
        }
    }, [gameOver, user?.id])
}

export default useAddNewScore
