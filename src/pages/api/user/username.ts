import { NextApiRequest, NextApiResponse } from 'next'
import { fetchOthersProfile } from '@/lib/actions/username/username.actions'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res
            .status(405)
            .json({ success: false, error: 'Method not allowed' })
    }

    const clerkId = Array.isArray(req.query.clerkId)
        ? req.query.clerkId[0]
        : req.query.clerkId

    if (!clerkId) {
        return res
            .status(400)
            .json({ success: false, error: 'clerkId is required' })
    }

    // Directly pass the response object
    return fetchOthersProfile(clerkId, res)
}
