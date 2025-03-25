import { Schema, model, models } from 'mongoose'

const heatmapEntrySchema = new Schema({
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    count: { type: Number, default: 0 },
})

const UserSchema = new Schema({
    clerkId: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    Photo: {
        type: String,
    },
    highestWpm: {
        highestScore10s: {
            type: Number,
            default: 0,
        },
        highestScore30s: {
            type: Number,
            default: 0,
        },
        highestScore60s: {
            type: Number,
            default: 0,
        },
        highestScore120s: {
            type: Number,
            default: 0,
        },
    },
    dailyHighestWpm: {
        dailyHighestScore10s: {
            type: Number,
            default: 0,
        },
        dailyHighestScore60s: {
            type: Number,
            default: 0,
        },
        dailyHighestScore30s: {
            type: Number,
            default: 0,
        },
        dailyHighestScore120s: {
            type: Number,
            default: 0,
        },
    },
    recentWpmScores: {
        scores10s: {
            type: [Number],
            default: [],
        },
        scores30s: {
            type: [Number],
            default: [],
        },
        scores60s: {
            type: [Number],
            default: [],
        },
        scores120s: {
            type: [Number],
            default: [],
        },
    },
    heatmap: {
        type: [heatmapEntrySchema], // Array of heatmap entries
        default: [], // Initialize as an empty array
    },
})
const User = models?.User || model('User', UserSchema)

export default User
