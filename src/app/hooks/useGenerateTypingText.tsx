import { useEffect, useState } from 'react'

import { getRandomSentence } from '@/lib/actions/sentences.actions'
const fetchRamdomQuote = async (minLength: number = 300) => {
    try {
        const sentence = await getRandomSentence()
        return sentence
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
        fetchRamdomQuote(300).then((quote: any) => {
            console.log(quote)
            if (quote) {
                setTypingSuggestion(quote.story)
            }
        })
    }, [])
    return { typingSuggestion }
}
