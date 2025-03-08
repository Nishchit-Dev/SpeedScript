import { useState, useCallback } from 'react'

const useTimer = () => {
    const [timerCount, setTimerCount] = useState(0)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

    const startTimer = useCallback(() => {
        setTimerCount(0)
        if (intervalId === null) {
            const id = setInterval(() => {
                setTimerCount((prevCount) => prevCount + 1)
            }, 1000)
            setIntervalId(id)
        }
    }, [intervalId])

    const stopTimer = useCallback(() => {
        if (intervalId !== null) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
    }, [intervalId])
    const resetTimer = useCallback(() => {
        stopTimer() 
        setTimerCount(0)
        if (intervalId !== null) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
    }, [intervalId])

    return { timer: timerCount, startTimer, stopTimer, resetTimer }
}

export default useTimer
