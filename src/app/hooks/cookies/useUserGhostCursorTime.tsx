const useUserGhostCursorTime = () => {
    const USERGHOSTCURSOR = 'USERGHOSTCURSOR'

    // Save the user's score with a queue of previous velocity values
    const saveUserScore = ({
        userGhostCursorTimeVelocity,
        userGhostWpm,
    }: {
        userGhostCursorTimeVelocity: number
        userGhostWpm: number
    }) => {
        const storedData = JSON.parse(
            localStorage.getItem(USERGHOSTCURSOR) || '{}'
        )

        // Initialize the previousWpm and previousVelocity queues or use the existing ones
        const previousWpm = Array.isArray(storedData.previousWpm)
            ? storedData.previousWpm
            : []
        const previousVelocity = Array.isArray(storedData.previousVelocity)
            ? storedData.previousVelocity
            : []

        // Update the queues to maintain a fixed size of 10
        const updatedWpmQueue = [...previousWpm, userGhostWpm].slice(-10)
        const updatedVelocityQueue = [
            ...previousVelocity,
            userGhostCursorTimeVelocity,
        ].slice(-10)

        // Save the new data with updated queues
        const updatedData = {
            time: userGhostCursorTimeVelocity,
            wpm: userGhostWpm,
            previousWpm: updatedWpmQueue,
            previousVelocity: updatedVelocityQueue,
        }

        localStorage.setItem(USERGHOSTCURSOR, JSON.stringify(updatedData))
    }

    // Retrieve the user's ghost cursor data
    const getUserGhostCursor = () => {
        return JSON.parse(localStorage.getItem(USERGHOSTCURSOR) || '{}')
    }

    // Calculate the average of previous WPM values (ignoring zeros)
    const calculateAverageWpm = (): number => {
        const storedData = getUserGhostCursor()

        // Safeguard: Ensure previousWpm is an array
        const previousWpm = Array.isArray(storedData.previousWpm)
            ? storedData.previousWpm
            : []

        // Convert all values to numbers and filter out invalid (non-number or zero) WPM values
        const validWpmValues = previousWpm
            .map((wpm: any) => Number(wpm)) // Convert to number
            .filter((wpm: number) => !isNaN(wpm) && wpm !== 0) // Exclude NaN and zeros

        if (validWpmValues.length === 0) return 0 // Avoid division by zero

        const sum = validWpmValues.reduce(
            (total: number, wpm: number) => total + wpm,
            0
        )
        return sum / validWpmValues.length
    }

    // Calculate the average of previous velocity values (ignoring zeros)
    const calculateAverageVelocity = (): number => {
        const storedData = getUserGhostCursor()

        // Check if storedData is an empty object
        const isEmptyObject = (obj: object) => {
            return Object.keys(obj).length === 0 && obj.constructor === Object
        }

        if (isEmptyObject(storedData)) return -1

        // Safeguard: Ensure previousVelocity is an array
        const previousVelocity = Array.isArray(storedData.previousVelocity)
            ? storedData.previousVelocity
            : []

        // Convert all values to numbers and filter out invalid (non-number or zero) velocity values
        const validVelocityValues = previousVelocity
            .map((velocity: any) => Number(velocity)) // Convert to number
            .filter((velocity: number) => !isNaN(velocity) && velocity !== 0) // Exclude NaN and zeros

        if (validVelocityValues.length === 0) return 0 // Avoid division by zero

        const sum = validVelocityValues.reduce(
            (total: number, velocity: number) => total + velocity,
            0
        )
       
        return sum / validVelocityValues.length
    }

    return {
        saveUserScore,
        getUserGhostCursor,
        calculateAverageWpm,
        calculateAverageVelocity,
    }
}

export default useUserGhostCursorTime
