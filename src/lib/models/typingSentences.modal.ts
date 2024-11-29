import { Schema, models, model } from 'mongoose'

const TypingSentencesSchema = new Schema({
    story: {
        type: String,
        required: true,
    },
    totalCharacters: {
        type: Number,
        required: true,
    },
    totalWords: {
        type: Number,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    __v: {
        type: Number,
        default: 0,
    },
})

const TypingSentences =
    models?.typingsentences || model('typingsentences', TypingSentencesSchema)

export default TypingSentences
