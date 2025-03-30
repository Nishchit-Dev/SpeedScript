'use client'
import Image from 'next/image'
import './heatmap.css' // Custom styles for the heatmap
import { useHeatmapData } from '@/app/hooks/useHeatmapData'
import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

interface HeatmapProps {
    clerkId: string
}

export default function Heatmap({ clerkId }: HeatmapProps) {
    const startDate = '2025-01-01'
    const endDate = '2025-12-31'
    const { heatmapData, loading, error } = useHeatmapData(
        clerkId,
        startDate,
        endDate
    )

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    // Transform the heatmap data into the format required by react-calendar-heatmap
    const heatmapValues = Object.entries(heatmapData).map(([date, count]) => ({
        date,
        count,
    }))
    const colors = ['#c1c1c1', '#0E4429', '#006D32', '#26A641', '#39D353']

    return (
        <div className="w-full flex flex-1 flex-row    font-jetBrainsMono  gap-2">
            <div className="bg-[#212830] p-5 pr-10 rounded-lg w-full">
                <h2 className="text-white text-lg text-center">
                    Typing Activity (2025)
                </h2>
                <CalendarHeatmap
                    showOutOfRangeDays={false} // Hide days outside the range
                    showWeekdayLabels={true} // Show month labels
                    startDate={new Date(startDate)}
                    endDate={new Date(endDate)}
                    values={heatmapValues}
                    classForValue={(value) => {
                        if (!value) {
                            return '#c1c1c1'
                        }
                        return `color-scale-${Math.min(value.count, 4)}`
                    }}
                />
            </div>

            <div className="flex flex-col gap-2 justify-center bg-[#212830] rounded-lg px-4">
                {/* <p className="text-white/70 text-center">Color</p> */}
                <div className="flex flex-col gap-1 justify-center">
                    {colors.map((color, index) => {
                        return (
                            <div key={color} className="flex flex-row gap-2 justify-center items-center text-white/50 text-sm">
                                <div 
                                    style={{ background: color }}
                                    className="w-4 h-4"
                                ></div>
                                <p>{index + 1}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
