'use client'

import { addNewScore } from '@/lib/actions/score.actions'
import { useUser } from '@clerk/nextjs'

import { useEffect } from 'react'

export default function Home() {
    const { user } = useUser()

    useEffect(() => {
        console.log(user?.id)
    }, [])

    return (
        <div className="flex flex-1 justify-center items-center h-screen">
            <button
                className="bg-blue-600 px-5 py-3 rounded-full"
                onClick={async () => {
                    console.log(user?.id)
                    await addNewScore(
                        user?.id || 'aa',
                        user?.id || 'bb',
                        '100',
                        '100'
                    )
                }}
            >
                Add Score
            </button>
        </div>
    )
}
