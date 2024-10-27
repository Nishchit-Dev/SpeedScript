import { useCallback, useEffect, useState } from 'react'

const useInformative = (data: any[]) => {
    const [avgTimeToHitChar, setAverageTimeToHitChar] = useState(0)
    const [lowestTimeToHitChar, setLowestTimeToHitChar] = useState(0)
    const [highestTimeToHitChar, setHighestTimeToHitChar] = useState(0)
    const [finalData, setFinalData] = useState<any[]>([])

    const averageTimeToHitChar = (data: any[]) => {
        const totalTime = data.reduce((acc, curr) => acc + curr.time, 0)
        setAverageTimeToHitChar(totalTime / data.length)
    }
    const LowestTimeToHitChar = (data: any[]) => {
        const nonZeroTimes = data.map(item => item.time).filter(time => time !== 0);
        if (nonZeroTimes.length > 0) {
            setLowestTimeToHitChar(Math.min(...nonZeroTimes));
        } else {
            setLowestTimeToHitChar(0); // Default value if all times are zero
        }
    }

    const HighestTimeToHitChar = (data: any[]) => {
        setHighestTimeToHitChar(Math.max(...data.map((item) => item.time)))
    }
    const calculateTimeDifferences = (dataArray: any[] = []) => {
        if (dataArray.length < 2) {
            return []
        }

        const timeDifferences = []
        let previousTime = dataArray[0].time

        for (let i = 1; i < dataArray.length; i++) {
            const currentTime = dataArray[i].time
            const difference = currentTime - previousTime
            timeDifferences.push({
                data: dataArray[i].char,
                time: difference / 1000,
            })
            previousTime = currentTime
        }

        // Set the first key press time to 0
        timeDifferences.unshift({
            data: dataArray[0].char,
            time: 0,
        })

        return timeDifferences
    }

    const calculateFinalData = useCallback(() => {
        if (data.length > 0) {
            let _data = calculateTimeDifferences(data)
            return _data.map((item) => ({
                data: item.data,
                time: item.time,
            }))
        }
        return []
    }, [data])
    useEffect(() => {
        setFinalData(calculateFinalData())
    }, [data])

    useEffect(() => {
        averageTimeToHitChar(finalData)
        LowestTimeToHitChar(finalData)
        HighestTimeToHitChar(finalData)
    }, [finalData])

    return {
        avgTimeToHitChar,
        lowestTimeToHitChar,
        highestTimeToHitChar,
    }
}

export default useInformative
