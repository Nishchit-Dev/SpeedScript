'use server'

import Score from '@/lib/models/score.modal'

import { connect } from '@/lib/db'

export async function addNewScore(
    userId: string,
    clerkId: string,
    wpm: string,
    accuracy: string
) {
    try {
        const res = await connect()
        const newScore = await Score.create({ userId, clerkId, wpm, accuracy })
        return JSON.parse(JSON.stringify(newScore))
    } catch (err) {
        console.log(err)
    }
}
