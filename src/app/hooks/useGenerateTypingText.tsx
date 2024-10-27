import { useEffect, useState } from 'react'

// Replace `YOUR_API_KEY` with your actual API key
const apiKey = process.env.OPENAI_API_KEY
const endpoint = 'https://api.openai.com/v1/completions'

async function getTypingSuggestions() {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003', // or other model names depending on your requirements
            prompt: 'Generate a sentence for typing practice. It should only include English words, contain no numbers, symbols, or special characters.',
            max_tokens: 10, // Adjust token limit as needed
        }),
    })
    const data = await response.json()
    return data.choices[0].text.trim()
}

export default function useGenerateTypingText() {
    const [typingSuggestion, setTypingSuggestion] = useState('')
    useEffect(() => {
        getTypingSuggestions().then((suggestion) => {
            setTypingSuggestion(suggestion)
        })
    }, [])
    return { typingSuggestion }
}
