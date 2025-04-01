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

interface TimexWpmProps {
    data: number[]
    timer: number
}

const TimexWpm = ({ data , timer }: TimexWpmProps) => {
    if (data.length === 0) return <></>

    return (
        <LineChart
        className="flex flex-1 w-max"

            height={250}
            width={0.7 * innerWidth}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
            }}
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
                endIndex={timer - 1}
                dataKey="time"
                height={30}
                stroke="#4ADE80"
            />
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
