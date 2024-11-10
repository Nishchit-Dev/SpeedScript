'use client'

import { Cover } from '@/components/ui/cover'
import { addNewScore } from '@/lib/actions/score.actions'
import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import { EmailAddress } from '@clerk/nextjs/server'
import Link from 'next/link'

import { useEffect } from 'react'

export default function Home() {
    const { user, isSignedIn, isLoaded } = useUser()

    useEffect(() => {
        if (user?.id) {
            ;(() => {
                getUserIdByClerkId(user?.id).then((res) => {
                    console.log(res)
                })
            })()
        }
    }, [user])

    return (
        <div className="flex flex-1 justify-center items-center h-[70vh]">
            <div className="flex flex-col ">
                <h1 className="text-4xl font-jetBrainsMono font-semibold mb-10">
                    Welcome to <Cover>SpeedScript</Cover>
                </h1>
                <div className="flex flex-row font-jetBrainsMono gap-5">
                    <Link
                        href={"/sign-in"}
                        className="bg-green-600 px-5 py-3 rounded-full w-full text-white justify-center items-center flex"
                        onClick={() => {

                        }}
                    >
                        SignIn
                    </Link>
                    <Link
                        href={"/sign-up"}
                        className="bg-black/70 px-5 py-3 rounded-full w-full text-white justify-center items-center flex"
                        onClick={() => {

                        }}
                    >
                        SignUp
                    </Link>
                </div>
                <div className="pt-3">
                <Link
                        href={"/type"}
                        className="bg-yellow-600 px-5 py-3 rounded-full w-full text-white justify-center items-center flex font-jetBrainsMono"
                        onClick={() => {

                        }}
                    >
                        Start Typing
                    </Link>
                </div>
            </div>
        </div>
    )
}
