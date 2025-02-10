'use server'
import { connect } from '@/lib/db'
import User from '../models/user.modals'
import TypingSentences from '../models/typingSentences.modal'

// Function to get MongoDB ID using clerkId
export async function getRandomSentence(): Promise<Object | null> {
    try {
        const res = await connect().then(async () => {
            const sentence = await TypingSentences.aggregate([
                { $sample: { size: 1 } } // Randomly select 1 document
            ])
            if (sentence.length > 0) {
                return JSON.parse(JSON.stringify(sentence[0])) // Return the first (and only) document
            } else {
                return null
            }
        })
        return res || null
    } catch (error: any) {
        throw new Error('Could not retrieve user ID')
    }
}

// this function is used to link the clerkId with the user's _id
export async function updateUserWithClerkId(userId: string, clerkId: string) {
    const res = await connect()
    await User.findByIdAndUpdate(userId, { clerkId })
}
