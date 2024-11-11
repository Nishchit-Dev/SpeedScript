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

const TimexWpm = ({ data }: { data: any[] }) => {
    console.log(data)
    return (
        <LineChart
            height={300}
            width={innerWidth * 0.5}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
            }}
            className="flex flex-1 "
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" name="Time (s)" label={{ value: "Time (s)", position: "insideBottomCenter", offset: 0, }} />
            <YAxis dataKey="wpm" name="WPM" label={{ value: "WPM", angle: -90, position: "insideLeft" }} domain={[0, 100]} />


            <Tooltip />
            <Legend />
            <Brush endIndex={25} dataKey="bar" height={30} stroke="#4ADE80" />
            <Line
                type="monotone"
                dataKey="wpm"
                stroke="#4ADE80"
                strokeWidth={2}
            />
        </LineChart>
    )
}

export default TimexWpm
