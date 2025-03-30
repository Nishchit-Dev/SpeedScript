'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getClerkIdByUsername } from '@/lib/actions/user.actions'
import ProfileComponent from '../profile/profile'
import Heatmap from '../Heatmap.tsx/HeatMap'

export default function Page() {
    const params = useParams()
    const [user, setUser] = useState({ id: '' })
    useEffect(() => {
        const username = params?.slug
        if (typeof username === 'string' && username.length !== 0) {
            getClerkIdByUsername(username)
                .then((user) => {
                    console.log('Fetched user:', user)
                    if (user) setUser({ id: user })
                })
                .catch((error) => {
                    console.error('Error fetching user:', error)
                })
        }
    }, [])

    const [flag, setFlag] = useState(false)
    useEffect(() => {
        if (user?.id) {
            setFlag(true)
        } else {
            setFlag(false)
        }
    }, [user])
    return (
        <div className="flex flex-1 justify-center items-start h-screen font-jetBrainsMono ">

            {/* <UserProfile routing="hash" /> */}
            <div className="flex flex-col gap-10">
                <div className="flex flex-row gap-10">
                    <ProfileComponent clerkId={user?.id || ''}>
                        {flag ? (
                            <Heatmap clerkId={user?.id || ''} />
                        ) : (
                            <p>Loading</p>
                        )}
                    </ProfileComponent>
                </div>
            </div>
        </div>
    )
}
