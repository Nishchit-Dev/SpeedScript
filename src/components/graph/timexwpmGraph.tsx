import { useCookiesScore } from '@/app/hooks/cookies/useCookies'
import { calculateTimeDifferences, getUserHisotry } from '@/lib/helper'
import { AreaChart } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import {
    Area,
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

const TimexWpm = ({ data, timer }: { data: any[]; timer: number }) => {
    if (data.length == 0) return <></>

    return (
        <LineChart
            height={400}
            width={innerWidth * 0.6}
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
            <XAxis
                dataKey="time"
                name="Time (s)"
                label={{
                    value: 'Time (s)',
                    position: 'insideBottomCenter',
                    offset: 0,
                }}
            />
            <YAxis
                dataKey="wpm"
                name="WPM"
                label={{ value: 'WPM', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
            />

            <Tooltip />
            <Legend />
            <Brush
                endIndex={timer > 30 ? timer / 3 : timer }
                dataKey="bar"
                height={30}
                stroke="#4ADE80"
            />

            <ReferenceArea
                type="monotone"
                stroke="#8884d8"
                fillOpacity={1}
                fill="#8884d8"
            />
            {/* Line for WPM */}
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
