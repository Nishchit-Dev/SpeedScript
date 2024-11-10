'use server'

import Score from '@/lib/models/score.modal'

import { connect } from '@/lib/db'
import User from '../models/user.modals'

export async function addNewScore(
    userId: string,
    wpm: number,
    accuracy: number
) {
    try {
        if (userId != null) {
            console.log(userId)
            const res = await connect().then(async () => {
                const HighestWpm = await User.updateOne(
                    { clerkId: userId },
                    { $max: { highestWpm: wpm } },
                    { upsert: true }
                )

                const AddScoreLeaderBoard = await Score.create({
                    clerkId: userId,
                    wpm,
                })
                return { AddScoreLeaderBoard, HighestWpm }
            })
            // const newScore = await Score.create({ userId, wpm, accuracy })

            return JSON.parse(JSON.stringify(res.AddScoreLeaderBoard))
        } else {
            return JSON.stringify({ error: 'userId should not be null' })
        }
    } catch (err) {
        console.log(err)
    }
}

export const getLeaderboard = async () => {
    try {
        const res = await connect().then(async () => {
            const leaderboard = await User.find({}, 'username highestWpm')
                .sort({ highestWpm: -1 }) // Sort by highestWpm in descending order
                .limit(10) // Limit to top 10 entries (or adjust as needed)
            console.log(leaderboard)
            return leaderboard
        })

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}
