'use server'

import User from '@/lib/models/user.modals'
import { connect } from '@/lib/db'
import { sendWelcomeEmail } from './sendEmail/welcome.actions'

export async function createUser(user: any) {
    try {
        const res = await connect()
        const newUser = await User.create(user)
        if (newUser.email) {
            // Assuming you have a sendEmail function available
            await sendWelcomeEmail(newUser.email, newUser.username)
        }

        return newUser
    } catch (err) {}
}

// Function to get MongoDB ID using clerkId
export async function getUserIdByClerkId(
    clerkId: string | null
): Promise<Object | null> {
    try {
        const res = await connect()
        const user = await User.findOne({ clerkId })
        if (user) {
            return JSON.parse(JSON.stringify(user))
        } else {
            return null
        }
    } catch (error) {
        console.error('Error fetching user by clerkId:', error)
        throw new Error('Could not retrieve user ID')
    }
}

// this function is used to link the clerkId with the user's _id
export async function updateUserWithClerkId(userId: string, clerkId: string) {
    const res = await connect()
    await User.findByIdAndUpdate(userId, { clerkId })
}
