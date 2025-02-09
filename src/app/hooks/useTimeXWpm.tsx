import { useEffect, useState } from 'react'

interface timeXwpmInterface {
    time: number
    wpm: number
}

export const useTimexWpm = ({ timer, wpm }: { timer: number; wpm: number }) => {
    const [timexwpm, setTimeXWpm] = useState<timeXwpmInterface[]>([])
    useEffect(() => {
        setTimeXWpm((prev: timeXwpmInterface[]) => [
            ...prev,
            { time: timer, wpm: wpm },
        ])
    }, [timer])

    return { timexwpm }
}
