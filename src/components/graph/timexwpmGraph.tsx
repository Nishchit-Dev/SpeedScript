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
            <XAxis dataKey="time" name="time" />
            <YAxis dataKey="wpm" name="wpm" />

            <Tooltip />
            <Legend />
            <Brush endIndex={20} dataKey="bar" height={30} stroke="#4ADE80" />
            <Line
                type="monotone"
                dataKey="time"
                stroke="#4ADE80"
                strokeWidth={2}
            />
        </LineChart>
    )
}

export default TimexWpm
