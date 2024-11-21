import { Schema, model, models } from 'mongoose'

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
        type: Number,
        default: 0,
    },
    dailyHighestWpm: {
        type: Number,
        default: 0,
    },
})
const User = models?.User || model('User', UserSchema)

export default User
