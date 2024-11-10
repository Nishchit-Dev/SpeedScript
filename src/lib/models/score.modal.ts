import { Schema, models, model } from 'mongoose'

const ScoreSchema = new Schema(
    {
        clerkId: {
            type: String,
            required: true,
        },
        wpm: {
            type: Number,
            required: true,
        },
        accuracy: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
)

const Score = models?.Score || model('Score', ScoreSchema)

export default Score
