'use client'
import { UserProfile, useUser } from '@clerk/nextjs'
import Heatmap from './Heatmap.tsx/HeatMap'
import { useEffect, useState } from 'react'
import { populateData } from '@/lib/actions/user.actions'
import { set } from 'mongoose'
import Image from 'next/image'
import ProfileComponent from './profile/profile'

export default function Profile() {
    const { user } = useUser()

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
