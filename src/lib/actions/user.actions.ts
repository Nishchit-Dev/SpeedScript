'use server'

import User from '@/lib/models/user.modals'
import { connect } from '@/lib/db'

export async function createUser(user: any) {
    try {
        const res = await connect()
        const newUser = await User.create(user)

        return newUser
    } catch (err) {
        console.log(err)
    }
}

// Function to get MongoDB ID using clerkId
export async function getUserIdByClerkId(
    clerkId: string | null
): Promise<Object | null> {
    try {
        console.log(clerkId)
        const res = await connect()
        const user = await User.findOne({ clerkId })
        console.log(user)
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
