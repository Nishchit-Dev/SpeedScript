import { useEffect, useState } from 'react'
import axios from 'axios'
const fetchRamdomQuote = async (minLength: number = 300) => {
    const url = 'https://shortstories-api.onrender.com/'
    try {
        const storyApi = await axios.get(url)
        console.log(storyApi.data.story)
        return storyApi.data.story
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'An unknown error occurred'
        console.error('Error fetching the random quote:', errorMessage)
        throw error
    }
}

export default function useGenerateTypingText() {
    const [typingSuggestion, setTypingSuggestion] = useState('')
    useEffect(() => {
        fetchRamdomQuote(300).then((quote) => {
            setTypingSuggestion(quote)
        })
    }, [])
    return { typingSuggestion }
}
