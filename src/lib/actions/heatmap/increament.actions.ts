import { connect } from '@/lib/db'
import User from '@/lib/models/user.modals' // Adjust the import path as necessary
import { Types } from 'mongoose'

/**
 * Updates the heatmap for a user by incrementing the count for a specific date.
 * @param clerkId - The clerkId of the user.
 * @param date - The date in "YYYY-MM-DD" format.
 * @returns A success status and optional error message.
 */
export async function updateHeatmap(
    clerkId: string,
    date: string
): Promise<{ success: boolean; error?: string }> {
    // Validate inputs first (fast operation)
    if (!clerkId || !date) {
        return {
            success: false,
            error: 'Missing clerkId or date',
        }
    }

    try {
        // 1. Connect with timeout settings
        await connect()

        // 2. Combine operations in a single transaction when possible
        const result = await User.bulkWrite([
            {
                updateOne: {
                    filter: { clerkId, 'heatmap.date': date },
                    update: { $inc: { 'heatmap.$.count': 1 } },
                },
            },
            {
                updateOne: {
                    filter: { clerkId, 'heatmap.date': { $ne: date } },
                    update: { $push: { heatmap: { date, count: 1 } } },
                    upsert: true,
                },
            },
        ])

        return { success: true }
    } catch (error) {
        console.error('Error updating heatmap:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
