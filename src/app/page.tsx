'use client'
import { createUser } from '@/lib/actions/user.actions'
import Image from 'next/image'

export default function Home() {
    return (
        <div className="flex flex-1 justify-center items-center h-screen">
            <button
                className="px-5 py-2 bg-blue-600 rounded-full"
                onClick={async (e) => {
                    const user = {
                        clerkId: 'user_2ntbtJ8eeRbMSbWsXUShY5nvigG',
                        email: 'nishchitpatel84@gmail.com',
                        firstName: 'Nishchit',
                        lastName: 'Malasana',
                        username: null,
                        Photo: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybnRidE45QkN4dEoyS0ZPYUwwbXViM09kZUMifQ',
                    }
                    console.log('clicked')
                    await createUser(user)
                }}
            >
                create user
            </button>
        </div>
    )
}
