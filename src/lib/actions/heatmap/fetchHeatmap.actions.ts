import User from '@/lib/models/user.modals' // Adjust the import path as necessary
import { connect } from '@/lib/db'

/**
 * Fetches heatmap data for a user within a specific date range.
 * @param clerkId - The clerkId of the user.
 * @param startDate - The start date in "YYYY-MM-DD" format.
 * @param endDate - The end date in "YYYY-MM-DD" format.
 * @returns A success status, heatmap data, and optional error message.
 */
export async function getHeatmapData(
    clerkId: string,
    startDate: string,
    endDate: string
): Promise<{
    success: boolean
    heatmapData?: Record<string, number>
    error?: string
}> {
    try {
        await connect()
        const user = await User.findOne({ clerkId })

        if (!user) {
            throw new Error('User not found')
        }

        console.log(user.heatmap) // Debugging line to check the fetched heatmap data
        // Convert the heatmap array to a key-value object
        const heatmapData = user.heatmap.reduce((acc: any, entry: any) => {
            acc[entry.date] = entry.count
            return acc
        }, {} as Record<string, number>)

        console.log(heatmapData)
        return { success: true, heatmapData }
    } catch (error) {
        console.error('Error fetching heatmap data:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
