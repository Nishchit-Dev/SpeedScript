import { useCallback, useEffect, useState } from 'react'
import useUserGhostCursorTime from '../cookies/useUserGhostCursorTime'

const useGhostCursor = ({
    gameOver,
    ghost,
}: {
    gameOver: boolean
    ghost: boolean
}) => {
    const [cursorPosition, setPosition] = useState({ x: 0, y: 0 })
    const [countIndex, setCountIndex] = useState(0)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
    const {
        getUserGhostCursor,
        calculateAverageWpm,
        calculateAverageVelocity,
    } = useUserGhostCursorTime()
    useEffect(() => {
        getPosition()
    }, [countIndex])

    const getPosition = () => {
        const element = document.querySelector(`.character${countIndex}`)

        const rct = element?.getBoundingClientRect()

        const x = rct?.left
        const y = rct?.top
        const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        if (x && y) setPosition({ x: x + scrollX, y: y + scrollY })
    }

    const startGhostCursor = useCallback(() => {
        // let time = getUserGhostCursor().time + createCursorIntervalRandom()
        const calcualtedVelocity = calculateAverageVelocity()
        if (calcualtedVelocity >= 0) {
            let time = calculateAverageVelocity() * 10

            if (intervalId === null) {
                const id = setInterval(() => {
                    setCountIndex((prevCount) => prevCount + 1)
                }, time)
                setIntervalId(id)
            }
        }
    }, [gameOver])
    const stopTimer = useCallback(() => {
        if (intervalId !== null) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
    }, [intervalId])

    return {
        x: cursorPosition.x,
        y: cursorPosition.y,
        startGhostCursor,
        stopTimer,
        ghostCursorIndex: countIndex,
    }
}

export default useGhostCursor
