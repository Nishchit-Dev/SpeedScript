import { useEffect, useState } from 'react'

const useUserGhostCursorTime = () => {
    const USERGHOSTCURSOR = 'USERGHOSTCURSOR'

    const saveUserScore = ({
        userGhostCursorTimeVelocity,
        userGhostWpm,
    }: {
        userGhostCursorTimeVelocity: number
        userGhostWpm: number
    }) => {
        localStorage.setItem(
            USERGHOSTCURSOR,
            JSON.stringify({
                time: userGhostCursorTimeVelocity,
                wpm: userGhostWpm,
            })
        )
    }

    const getUserGhostCursor = () => {
        return JSON.parse(localStorage.getItem(USERGHOSTCURSOR) || '{}')
    }

    return { saveUserScore, getUserGhostCursor }
}

export default useUserGhostCursorTime
