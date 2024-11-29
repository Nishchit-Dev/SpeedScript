import { useCookiesScore } from '@/app/hooks/cookies/useCookies'
import { calculateTimeDifferences, getUserHisotry } from '@/lib/helper'
import { useCallback, useEffect, useState } from 'react'
import {
    Brush,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const ShowGraph = ({ data }: { data: any[] }) => {
    const [finalTimeGap, setFinalTimeGap] = useState<any[]>([])
    const [length, setLength] = useState(data.length - 1)
    const calculateFinalTimeGap = useCallback(() => {
        if (data.length > 0) {
            let _data = calculateTimeDifferences(data)
            return _data.map((item) => ({
                data: item.data,
                time: item.time,
            }))
        }
        return []
    }, [])

    useEffect(() => {
        setFinalTimeGap(calculateFinalTimeGap())
    }, [calculateFinalTimeGap])

    if (finalTimeGap.length == 0) return <></>

    return (
        <LineChart
            height={300}
            width={innerWidth * 0.6}
            data={finalTimeGap}
            margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
            }}
            className="flex flex-1 "
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" name="data" />
            <YAxis dataKey="time" name="time" />

            <Tooltip />
            <Legend />
            <Brush
                endIndex={Math.ceil(length / 2)}
                dataKey="bar"
                height={30}
                stroke="#EAB308"
            />
            <Line
                type="monotone"
                dataKey="time"
                stroke="#EAB308"
                strokeWidth={2}
            />
        </LineChart>
    )
}

export default ShowGraph
