import { useEffect } from 'react'

interface ResetHookProps {
    gameState: string
    function: {
        resetFunction?: () => void
        resetInWaiting?: () => void
    }
}

const useReset = ({
    gameState,
    function: { resetFunction,resetInWaiting },
}: ResetHookProps) => {
    // Your hook logic here

    useEffect(() => {
        if (gameState === 'finished'&& resetFunction) {
            resetFunction()
        }
        if (gameState === 'waiting' && resetInWaiting) {
            resetInWaiting()
        }
    }, [gameState])
}


export default useReset
