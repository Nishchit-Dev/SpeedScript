export const calculateTimeDifferences = (timestamps: any[] = []) => {
    if (timestamps.length < 2) {
        return []
    }

    const timeDifferences = []
    let previousTime = timestamps[0].time

    for (let i = 1; i < timestamps.length; i++) {
        const currentTime = timestamps[i].time
        const difference = currentTime - previousTime
        timeDifferences.push({
            data: timestamps[i].char,
            time: difference / 1000,
        })
        previousTime = currentTime
    }

    // Set the first key press time to 0
    timeDifferences.unshift({
        data: timestamps[0].char,
        time: 0,
    })

    return timeDifferences
}

export const getUserHisotry = () => {
    const ID = 'History'

    let stringyRawData = localStorage.getItem(ID)
    let parseData = stringyRawData ? JSON.parse(stringyRawData) : []
    console.log(parseData)
    if (parseData.wpm && parseData.data) {
        return parseData
    } else {
        return { error: 'no user history' }
    }
}
