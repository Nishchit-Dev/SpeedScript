'use server'

import User from '@/lib/models/user.modals'
import { connect } from '@/lib/db'

export async function createUser(user: any) {
    try {
        const res = await connect()
        console.log(res)
        const newUser = await User.create(user)
        return JSON.parse(JSON.stringify(newUser))
    } catch (err) {
        console.log(err)
    }
}

// Function to get MongoDB ID using clerkId
export async function getUserIdByClerkId(
    clerkId: string | null
): Promise<Object | null> {
    try {
        console.log('Fetching user...')
        const res = await connect()
        const user = await User.findOne({ clerkId })
        return user ? user._id.toString() : null
    } catch (error) {
        console.error('Error fetching user by clerkId:', error)
        throw new Error('Could not retrieve user ID')
    }
}
