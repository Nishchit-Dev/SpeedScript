import { useEffect, useState } from 'react'

interface ProfileData {
    _id: string
    clerkId: string
    email: string
    username: string
    Photo: string
    highestWpm: {
        highestScore10s: number
        highestScore30s: number
        highestScore60s: number
        highestScore120s: number
    }
    dailyHighestWpm: {
        dailyHighestScore10s: number
        dailyHighestScore30s: number
        dailyHighestScore60s: number
        dailyHighestScore120s: number
    }
    recentWpmScores: {
        scores10s: number[]
        scores30s: number[]
        scores60s: number[]
        scores120s: number[]
    }
}

export const useProfile = (clerkId: string) => {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(
                    `/api/user/profile?clerkId=${clerkId}`
                )
                console.log('Response:', response)
                const data = await response.json()
                console.log('Data:', data)

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch profile')
                }

                if (data.success && data.profile) {
                    setProfile(data.profile)
                } else {
                    throw new Error('Profile data is missing')
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch profile'
                )
                setProfile(null)
            } finally {
                setLoading(false)
            }
        }

        if (clerkId) fetchProfile()
    }, [clerkId])

    return { profile, loading, error }
}
