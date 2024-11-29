'use server'
import { connect } from '@/lib/db'
import User from '../models/user.modals'
import TypingSentences from '../models/typingSentences.modal'

// Function to get MongoDB ID using clerkId
export async function getRandomSentence(): Promise<Object | null> {
    try {
        console.log('fetching sentence')
        const res = await connect().then(async () => {
            console.log('fetching sentence from db')
            const sentence = await TypingSentences.findOne({
                _id: '67422f7c0f3a7a731efd1920',
            })
            console.log(sentence)
            if (sentence) {
                return JSON.parse(JSON.stringify(sentence))
            } else {
                return null
            }
        })
        return res || null
    } catch (error: any) {
        // console.log('Error fetching user by clerkId:', error.message)
        throw new Error('Could not retrieve user ID')
    }
}

// this function is used to link the clerkId with the user's _id
export async function updateUserWithClerkId(userId: string, clerkId: string) {
    const res = await connect()
    await User.findByIdAndUpdate(userId, { clerkId })
}
