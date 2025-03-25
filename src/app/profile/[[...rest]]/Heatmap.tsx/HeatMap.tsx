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

    return (
        <div className="w-full bg-[#212830] rounded-lg  font-jetBrainsMono p-5 pr-10">
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
                        return '#444649'
                    }
                    return `color-scale-${Math.min(value.count, 4)}`
                }}
            />
            <div></div>
        </div>
    )
}
