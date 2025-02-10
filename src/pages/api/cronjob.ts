import User from '@/lib/models/user.modals'
import { connect } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Reset leaderboard logic
        await connect()

        await User.updateMany(
            {}, // Match all users
            { $set: { dailyHighestWpm: 0 } } // Reset dailyHighestWpm to 0
        )
        res.status(200).json({ message: 'Leaderboard reset successfully' })
    } catch (error) {
        console.error('Error resetting leaderboard:', error)
        res.status(500).json({ error: 'Failed to reset leaderboard' })
    }
}
