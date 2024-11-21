'use server'

import Score from '@/lib/models/score.modal'

import { connect } from '@/lib/db'
import User from '../models/user.modals'
import mongoose from 'mongoose'

export async function addNewScore(
    userId: string,
    wpm: number,
    accuracy: number
) {
    try {
        if (userId != null) {
            const res = await connect().then(async () => {
                const HighestWpm = await User.updateOne(
                    { clerkId: userId },
                    { $max: { highestWpm: wpm } },
                    { upsert: true }
                )
                const dailyHighestWpm = await User.updateOne(
                    { clerkId: userId },
                    { $max: { dailyHighestWpm: wpm } },
                    { upsert: true }
                )

                const AddScoreLeaderBoard = await Score.create({
                    clerkId: userId,
                    wpm,
                })
                return { AddScoreLeaderBoard, HighestWpm, dailyHighestWpm }
            })

            return JSON.parse(res.AddScoreLeaderBoard)
        } else {
            return JSON.stringify({ error: 'userId should not be null' })
        }
    } catch (err) {
        console.log(err)
    }
}
export async function addNewScoreById(
    userId: string,
    wpm: number,
    accuracy: number
) {
    try {
        if (userId != null) {
            const _userId = new mongoose.Types.ObjectId(userId)
            const res = await connect().then(async () => {
                const HighestWpm = await User.updateOne(
                    { _id: _userId },
                    { $max: { highestWpm: wpm } },
                    { upsert: true }
                )
                const dailyHighestWpm = await User.updateOne(
                    { _id: userId },
                    { $max: { dailyHighestWpm: wpm } },
                    { upsert: true }
                )

                const AddScoreLeaderBoard = await Score.create({
                    clerkId: userId,
                    wpm,
                })
                return { AddScoreLeaderBoard, HighestWpm, dailyHighestWpm }
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
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { highestWpm: { $gt: 0 } },
                    'clerkId username highestWpm'
                )
                    .sort({ highestWpm: -1 }) // Sort by highestWpm in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}

export const getDailyLeaderboard = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { dailyHighestWpm: { $gt: 0 } },
                    '_id username dailyHighestWpm'
                )
                    .sort({ dailyHighestWpm: -1 }) // Sort by highestWpm in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)

                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}

interface UserRank {
    _id: string
    clerkId: string
    __v: number
    dailyHighestWpm: number
    highestWpm: number
    rank: number
}

export const getUserRank = async (
    userId: string = 'user_2p09O09z2vWDWgqdSvmcrj58MYQ'
): Promise<UserRank> => {
    try {
        const res = await connect().then(async () => {
            const leaderboard = await User.aggregate([
                { $match: { highestWpm: { $gt: 0 } } },
                { $sort: { highestWpm: -1 } },
                {
                    $setWindowFields: {
                        sortBy: {
                            highestWpm: -1,
                        },
                        output: {
                            rank: {
                                $rank: {},
                            },
                        },
                    },
                },
                { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            ])
            return leaderboard
        })
        if (res.length > 0) {
            const userRank = res[0]
            return {
                ...userRank,
                _id: userRank._id.toString(), // Convert ObjectId to a string
            }
        } else {
            return {
                _id: '',
                clerkId: '',
                __v: 0,
                dailyHighestWpm: 0,
                highestWpm: 0,
                rank: -1,
            } // User not found, return default UserRank with rank as -1
        }
    } catch (err) {
        throw err
    }
}
