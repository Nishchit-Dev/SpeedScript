import { Schema, models, model } from 'mongoose'

const ScoreSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    wpm: {
        type: String,
        required: true,
    },
    accuracy: {
        type: String
    },
})

const Score = models?.Score || model('Score', ScoreSchema)

export default Score
