import { useEffect, useState } from 'react'
import axios, { AxiosDefaults } from 'axios'
// Replace `YOUR_API_KEY` with your actual API key
// const apiKey = process.env.OPENAI_API_KEY
// const endpoint = 'https://api.openai.com/v1/completions'

// async function getTypingSuggestions() {
//     const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify({
//             model: 'text-davinci-003', // or other model names depending on your requirements
//             prompt: 'Generate a sentence for typing practice. It should only include English words, contain no numbers, symbols, or special characters.',
//             max_tokens: 10, // Adjust token limit as needed
//         }),
//     })
//     const data = await response.json()
//     return data.choices[0].text.trim()
// }

const fetchRamdomQuote = async (minLength: number = 300) => {
    const url = `http://api.quotable.io/random?&minLength=${minLength}`
    try {
        const Quote = await axios.get(url)
        console.log(Quote.data.content)
        return Quote.data.content
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
