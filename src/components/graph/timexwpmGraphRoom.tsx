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

const TimexWpmRoom = ({ data, timer }: { data: any[]; timer: number }) => {
    if (data.length === 0) return <></>

    // Prepare data for multiple lines
    const formattedData = data.map((player) => ({
        username: player.username,
        stats: player.stats,
    }))

    return (
        <LineChart
            height={400}
            width={innerWidth * 0.6}
            margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
            }}
            className="flex flex-1"
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
                allowDuplicatedCategory={false}
            />
            <YAxis
                name="WPM"
                label={{
                    value: 'WPM',
                    angle: -90,
                    position: 'insideLeft',
                }}
                domain={[0, 100]}
            />

            <Tooltip />
            <Legend />
            <Brush
                endIndex={timer > 30 ? Math.ceil(timer / 3) : timer}
                height={30}
                stroke="#4ADE80"
            />

            {/* Dynamically render lines for each player's stats */}
            {formattedData.map((player, index) => (
                <Line
                    key={player.username}
                    type="monotone"
                    dataKey="wpm"
                    data={player.stats}
                    name={player.username} // Display username in the legend
                    className=' opacity-70'
                    stroke={`hsl(${(index * 360) / formattedData.length}, 70%, 70%)`} // Generate unique color
                    strokeWidth={2}
                />
            ))}
        </LineChart>
    )
}

export default TimexWpmRoom
