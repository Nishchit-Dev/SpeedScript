'use server'

import Score from '@/lib/models/score.modal'
import { connect } from '@/lib/db'
import User from '../models/user.modals'
import mongoose from 'mongoose'


export async function addNewScore(
    userId: string,
    wpm: number,
    accuracy?: number,
    timeOptions?: number
) {
    try {
        if (userId != null) {
            let res = null
            switch (timeOptions) {
                case 10:
                    res = await connect().then(async () => {
                        const HighestWpm = await User.updateOne(
                            { clerkId: userId },
                            { $max: { 'highestWpm.highestScore10s': wpm } },
                            { upsert: true }
                        )
                        const dailyHighestWpm = await User.updateOne(
                            { clerkId: userId },
                            {
                                $max: {
                                    'dailyHighestWpm.dailyHighestScore10s': wpm,
                                },
                            },
                            { upsert: true }
                        )

                        const AddScoreLeaderBoard = await Score.create({
                            clerkId: userId,
                            wpm: { highestScore10s: wpm },
                        })
                        return {
                            AddScoreLeaderBoard,
                            HighestWpm,
                            dailyHighestWpm,
                        }
                    })
                    break

                case 30:
                    res = await connect().then(async () => {
                        const HighestWpm = await User.updateOne(
                            { clerkId: userId },
                            { $max: { 'highestWpm.highestScore30s': wpm } },
                            { upsert: true }
                        )
                        const dailyHighestWpm = await User.updateOne(
                            { clerkId: userId },
                            {
                                $max: {
                                    'dailyHighestWpm.dailyHighestScore30s': wpm,
                                },
                            },
                            { upsert: true }
                        )

                        const AddScoreLeaderBoard = await Score.create({
                            clerkId: userId,
                            wpm: { highestScore30s: wpm },
                        })
                        return {
                            AddScoreLeaderBoard,
                            HighestWpm,
                            dailyHighestWpm,
                        }
                    })
                    break

                case 60:
                    res = await connect().then(async () => {
                        const HighestWpm = await User.updateOne(
                            { clerkId: userId },
                            { $max: { 'highestWpm.highestScore60s': wpm } },
                            { upsert: true }
                        )
                        const dailyHighestWpm = await User.updateOne(
                            { clerkId: userId },
                            {
                                $max: {
                                    'dailyHighestWpm.dailyHighestScore60s': wpm,
                                },
                            },
                            { upsert: true }
                        )

                        const AddScoreLeaderBoard = await Score.create({
                            clerkId: userId,
                            wpm: { highestScore60s: wpm },
                        })
                        return {
                            AddScoreLeaderBoard,
                            HighestWpm,
                            dailyHighestWpm,
                        }
                    })
                    break

                case 120:
                    res = await connect().then(async () => {
                        const HighestWpm = await User.updateOne(
                            { clerkId: userId },
                            { $max: { 'highestWpm.highestScore120s': wpm } },
                            { upsert: true }
                        )
                        const dailyHighestWpm = await User.updateOne(
                            { clerkId: userId },
                            {
                                $max: {
                                    'dailyHighestWpm.dailyHighestScore120s': wpm,
                                },
                            },
                            { upsert: true }
                        )

                        const AddScoreLeaderBoard = await Score.create({
                            clerkId: userId,
                            wpm: { highestScore120s: wpm },
                        })
                        return {
                            AddScoreLeaderBoard,
                            HighestWpm,
                            dailyHighestWpm,
                        }
                    })
                    break
            }

            return JSON.parse(res?.AddScoreLeaderBoard)
        } else {
            return JSON.stringify({ error: 'userId should not be null' })
        }
    } catch (err) {}
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
                    { _id: _userId },
                    { $max: { dailyHighestWpm: wpm } },
                    { upsert: true }
                )

                const AddScoreLeaderBoard = await Score.create({
                    clerkId: userId,
                    wpm,
                })
                return { AddScoreLeaderBoard, HighestWpm, dailyHighestWpm }
            })
            const newScore = await Score.create({ userId, wpm, accuracy })

            return JSON.parse(JSON.stringify(res.AddScoreLeaderBoard))
        } else {
            return JSON.stringify({ error: 'userId should not be null' })
        }
    } catch (err) {}
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

export const getLeaderboard10s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'highestWpm.highestScore10s': { $gt: 0 } },
                    'clerkId username highestWpm.highestScore10s'
                )
                    .sort({ 'highestWpm.highestScore10s': -1 }) // Sort by highestScore10s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}

export const getLeaderboard30s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'highestWpm.highestScore30s': { $gt: 0 } },
                    'clerkId username highestWpm.highestScore30s'
                )
                    .sort({ 'highestWpm.highestScore30s': -1 }) // Sort by highestScore30s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}

export const getLeaderboard60s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'highestWpm.highestScore60s': { $gt: 0 } },
                    'clerkId username highestWpm.highestScore60s'
                )
                    .sort({ 'highestWpm.highestScore60s': -1 }) // Sort by highestScore60s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}

export const getLeaderboard120s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'highestWpm.highestScore120s': { $gt: 0 } },
                    'clerkId username highestWpm.highestScore120s'
                )
                    .sort({ 'highestWpm.highestScore120s': -1 }) // Sort by highestScore120s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching leaderboard:', err)
        throw err
    }
}

export const getDailyLeaderboard10s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'dailyHighestWpm.dailyHighestScore10s': { $gt: 0 } },
                    'clerkId username dailyHighestWpm.dailyHighestScore10s'
                )
                    .sort({ 'dailyHighestWpm.dailyHighestScore10s': -1 }) // Sort by dailyHighestScore10s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching daily leaderboard for 10s:', err)
        throw err
    }
}
export const getDailyLeaderboard30s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'dailyHighestWpm.dailyHighestScore30s': { $gt: 0 } },
                    'clerkId username dailyHighestWpm.dailyHighestScore30s'
                )
                    .sort({ 'dailyHighestWpm.dailyHighestScore30s': -1 }) // Sort by dailyHighestScore30s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching daily leaderboard for 30s:', err)
        throw err
    }
}

export const getDailyLeaderboard60s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'dailyHighestWpm.dailyHighestScore60s': { $gt: 0 } },
                    'clerkId username dailyHighestWpm.dailyHighestScore60s'
                )
                    .sort({ 'dailyHighestWpm.dailyHighestScore60s': -1 }) // Sort by dailyHighestScore60s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching daily leaderboard for 60s:', err)
        throw err
    }
}

export const getDailyLeaderboard120s = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { 'dailyHighestWpm.dailyHighestScore120s': { $gt: 0 } },
                    'clerkId username dailyHighestWpm.dailyHighestScore120s'
                )
                    .sort({ 'dailyHighestWpm.dailyHighestScore120s': -1 }) // Sort by dailyHighestScore120s in descending order
                    .limit(100) // Limit to top 100 entries (or adjust as needed)
                return leaderboard
            })) || []

        return JSON.parse(JSON.stringify(res))
    } catch (err) {
        console.error('Error fetching daily leaderboard for 120s:', err)
        throw err
    }
}

export const getDailyLeaderboard = async () => {
    try {
        const res =
            (await connect().then(async () => {
                const leaderboard = await User.find(
                    { dailyHighestWpm: { $gt: 0 } },
                    '_id clerkId username dailyHighestWpm'
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

export const getUserRank = async (userId: string): Promise<UserRank> => {
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
                { $match: { clerkId: userId } },
                {
                    $project: {
                        username: 1,
                        highestWpm: 1,
                        dailyHighestWpm: 1,
                        _id: 1,
                        clerkId: 1,
                        rank: 1,
                    },
                },
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


// Function to get leaderboards with configurable time duration
export const GetLeaderboard = async (duration = '10s') => {
    try {
        const res = await connect().then(async () => {
            const fieldName = `highestWpm.highestScore${duration}`;
            
            const leaderboard = await User.find(
                { [fieldName]: { $gt: 0 } },
                `clerkId username ${fieldName}`
            )
                .sort({ [fieldName]: -1 })
                .limit(100);
                
            return leaderboard;
        }) || [];

        return JSON.parse(JSON.stringify(res));
    } catch (err) {
        console.error(`Error fetching leaderboard for ${duration}:`, err);
        throw err;
    }
};

// Function to get daily leaderboards with configurable time duration
export const GetDailyLeaderboard = async (duration = '10s') => {
    try {
        const fieldName = `dailyHighestWpm.dailyHighestScore${duration}`;
        
        const res = await connect().then(async () => {
            const leaderboard = await User.find(
                { [fieldName]: { $gt: 0 } },
                `clerkId username ${fieldName}`
            )
                .sort({ [fieldName]: -1 })
                .limit(100);
                
            return leaderboard;
        }) || [];

        return JSON.parse(JSON.stringify(res));
    } catch (err) {
        console.error(`Error fetching daily leaderboard for ${duration}:`, err);
        throw err;
    }
};

// Optional: Get user rank with specific duration
// In score.actions.ts, modify getUserRank to return undefined instead of null
export const GetUserRank = async (userId="", duration = '10s') => {
    try {
        await connect();
        
        const highestField = `highestWpm.highestScore${duration}`;
        const dailyField = `dailyHighestWpm.dailyHighestScore${duration}`;
        
        // Find the user
        const user = await User.findOne({ clerkId: userId });
        if (!user) return undefined; // Changed from null to undefined

        // Rest of the function remains the same
        const highestScore = user.highestWpm?.[`highestScore${duration}`] || 0;
        const dailyScore = user.dailyHighestWpm?.[`dailyHighestScore${duration}`] || 0;

        // Count users with higher scores to determine rank
        const highestRank = await User.countDocuments({
            [highestField]: { $gt: highestScore }
        }) + 1;
        
        const dailyRank = await User.countDocuments({
            [dailyField]: { $gt: dailyScore }
        }) + 1;

        return {
            _id: user._id.toString(),
            clerkId: user.clerkId,
            highestWpm: highestScore,
            dailyHighestWpm: dailyScore,
            highestRank,
            dailyRank
        };
    } catch (err) {
        console.error('Error getting user rank:', err);
        return undefined; // Changed from throwing to returning undefined
    }
};


export async function addRecentWpmScore(
    userId: string,
    wpm: number,
    timeOptions: number
) {
    try {
        if (userId != null) {
            await connect();
            const user = await User.exists({ clerkId: userId });
            if (!user) {
                throw new Error('User not found');
            }

            let scoresArrayName = '';
            switch (timeOptions) {
                case 10:
                    scoresArrayName = 'recentWpmScores.scores10s';
                    break;
                case 30:
                    scoresArrayName = 'recentWpmScores.scores30s';
                    break;
                case 60:
                    scoresArrayName = 'recentWpmScores.scores60s';
                    break;
                case 120:
                    scoresArrayName = 'recentWpmScores.scores120s';
                    break;
                default:
                    throw new Error('Invalid time option');
            }

            const update = {
                $push: {
                    [scoresArrayName]: {
                        $each: [wpm],
                        $slice: -10
                    }
                }
            };

            await User.updateOne({ clerkId: userId }, update);
            return { success: true };
        } else {
            return { error: 'userId should not be null' };
        }
    } catch (err) {
        console.error('Error adding recent WPM score:', err);
        throw err;
    }
}