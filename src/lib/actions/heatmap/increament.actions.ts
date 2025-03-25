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
    try {
        // 1. First try to increment existing date
        const updateResult = await User.updateOne(
            { clerkId, 'heatmap.date': date },
            { $inc: { 'heatmap.$.count': 1 } }
        )

        // 2. If no document was modified (date didn't exist), add new entry
        if (updateResult.modifiedCount === 0) {
            await User.updateOne(
                { clerkId },
                { $push: { heatmap: { date, count: 1 } } },
                { upsert: true }
            )
        }

        return { success: true }
    } catch (error) {
        console.error('Error updating heatmap:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
