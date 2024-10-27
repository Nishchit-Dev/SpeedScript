import { useCallback, useEffect, useState } from 'react'
import {
    Brush,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const calculateTimeDifferences = (timestamps: any[] = []) => {
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

const ShowGraph = ({ data }: { data: any[] }) => {
    const [finalTimeGap, setFinalTimeGap] = useState<any[]>([])

    const calculateFinalTimeGap = useCallback(() => {
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
        setFinalTimeGap(calculateFinalTimeGap())
        console.log(finalTimeGap)
    }, [calculateFinalTimeGap])

    return (
        <LineChart
            width={innerWidth * 0.35}
            height={300}
            data={finalTimeGap}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            className=" flex flex-1"
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" name="data" />
            <YAxis dataKey="time" name="time" />
            <Tooltip />
            <Legend />
            <Brush endIndex={25} dataKey="bar" height={30} stroke="#4ADE80" />
            <Line
                type="monotone"
                dataKey="time"
                stroke="#4ADE80"
                strokeWidth={2}
            />
        </LineChart>
    )
}

export default ShowGraph
