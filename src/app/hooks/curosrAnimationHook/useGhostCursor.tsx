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
    const { getUserGhostCursor } = useUserGhostCursorTime()
    useEffect(() => {
        getPosition()
    }, [countIndex])

    const getPosition = () => {
        const element = document.querySelector(`.character${countIndex}`)

        const rct = element?.getBoundingClientRect()

        const x = rct?.left
        const y = rct?.top
        if (x && y) setPosition({ x: x, y: y })
    }

    function timePerKeyPress(wpm: number) {
        // Calculate time per word in seconds
        const timePerWord = 60 / wpm

        // Calculate time per key press (assuming 5 characters per word)
        const timePerKey = timePerWord / 5

        return timePerKey
    }
    const createCursorIntervalRandom = () => {
        let randomNumber = Math.floor(Math.random() * 51)
        console.log('randomNumber', randomNumber)
        return randomNumber
    }

    const startGhostCursor = useCallback(() => {
        // let time = getUserGhostCursor().time + createCursorIntervalRandom()
        let time = getUserGhostCursor().time * 10
        console.log('time', time)
        console.log('getUserGhostCursor().time', getUserGhostCursor().time)

        if (intervalId === null) {
            const id = setInterval(() => {
                setCountIndex((prevCount) => prevCount + 1)
            }, time)
            setIntervalId(id)
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
