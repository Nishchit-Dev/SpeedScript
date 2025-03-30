import { NextApiResponse } from 'next'
import { connect } from '@/lib/db'
import User from '@/lib/models/user.modals'

export async function fetchOthersProfile(
    clerkId: string,
    res: NextApiResponse
) {
    try {
        await connect()

        console.log('Fetching profile for:', clerkId)

        const user = await User.findOne({ clerkId })
            .select('-__v -createdAt -updatedAt -heatmap -email')
            .lean()

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: 'User not found' })
        }

        return res.status(200).json({ success: true, profile: user })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return res
            .status(500)
            .json({ success: false, error: 'Internal server error' })
    }
}
