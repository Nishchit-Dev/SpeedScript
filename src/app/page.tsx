'use client'

import { Cover } from '@/components/ui/cover'

import Link from 'next/link'
import useUserCookies from './hooks/cookies/useUser'

export default function Home() {
    const user = useUserCookies()
    return (
        <div className="flex flex-1 justify-center items-center h-[70vh]">
            <div className="flex flex-col ">
                <h1 className="text-4xl font-jetBrainsMono font-semibold mb-10">
                    Welcome to <Cover>SpeedScript</Cover>
                </h1>
                <div className="flex flex-row font-jetBrainsMono gap-5">
                    <>
                        <Link
                            href={'/sign-in'}
                            className="bg-green-600 px-5 py-3 rounded-full w-full text-white justify-center items-center flex"
                            onClick={() => {}}
                        >
                            SignIn
                        </Link>
                    </>

                    <>
                        <Link
                            href={'/sign-up'}
                            className="bg-black/70 px-5 py-3 rounded-full w-full text-white justify-center items-center flex"
                            onClick={() => {}}
                        >
                            SignUp
                        </Link>
                    </>
                </div>
                <div className="pt-3">
                    <Link
                        href={'/type'}
                        className="bg-yellow-600 px-5 py-3 rounded-full w-full text-white justify-center items-center flex font-jetBrainsMono"
                        onClick={() => {}}
                    >
                        Start Typing
                    </Link>
                </div>
            </div>
        </div>
    )
}
