'use client'
import FireAnimation from '@/app/lottieAnimation'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import {
    ArrowDown,
    Castle,
    Crown,
    DoorOpen,
    LogIn,
    MessageCircleDashed,
} from 'lucide-react'
import Link from 'next/link'
import WhatsNewInUpdates from './WhatsNewInUpdate'
import { useState } from 'react'
import clsx from 'clsx'

const NaivgationComponent = () => {
    const { user, isSignedIn } = useUser()
    const [roomFlag, setRoomFlag] = useState(false)
    return (
        <>
            <div className="flex flex-1 flex-row gap-3 items-center justify-end w-max">
                <div className="font-jetBrainsMono flex flex-row gap-3 justify-center items-center">
                    {isSignedIn ? (
                        <Link href={'/multiplayer'}>
                            <div className="flex flex-row px-5 py-2 text-sm text-black bg-white hover:bg-black/20 hover:text-white duration-300 rounded-full cursor-pointer">
                                Competitive
                                <FireAnimation />
                            </div>
                        </Link>
                    ) : (
                        <></>
                    )}
                    <Link href={'/leaderboard'}>
                        <div className="font-jetBrainsMono gap-2 duration-300 transition flex flex-row text-sm justify-center  bg-yellow-500 hover:bg-yellow-600 hover:text-white items-center px-4 py-2  rounded-full">
                            <Crown size={18} />
                            <p>Leaderboard</p>
                        </div>
                    </Link>
                    <Link href={'/room'}>
                    
                        <div
                            onClick={() => {
                                setRoomFlag(!roomFlag)
                            }}
                            className="w-full font-jetBrainsMono gap-2 duration-300 transition flex flex-row text-sm justify-center  bg-yellow-500 hover:bg-yellow-600 hover:text-white items-center px-4 py-2  rounded-full"
                        >
                            <Castle size={18} />
                            <p>Room</p>
                            <ArrowDown size={18} />
                            <div
                                onClick={() => {
                                    setRoomFlag(!roomFlag)
                                }}
                                className={clsx(
                                    'absolute opacity-0 transition-all duration-300 ease-in-out transform top-0 font-jetBrainsMono gap-2 flex-row text-sm justify-center bg-green-500 hover:bg-green-600 hover:text-white items-center px-4 py-2 rounded-full',
                                    { 'flex opacity-100 top-16': roomFlag },
                                    { hidden: !roomFlag }
                                )}
                            >
                                <DoorOpen size={18} />
                                <p>Create</p>
                            </div>
                            <div
                                onClick={() => {
                                    setRoomFlag(!roomFlag)
                                }}
                                className={clsx(
                                    'absolute transition-all duration-300 ease-in-out transform top-0 font-jetBrainsMono gap-2 flex-row text-sm justify-center bg-indigo-500 hover:bg-indigo-600 hover:text-white items-center px-4 py-2 rounded-full',
                                    { 'flex opacity-100 top-28': roomFlag },
                                    { hidden: !roomFlag }
                                )}
                            >
                                <LogIn size={18} />
                                <p>Join</p>
                            </div>
                        </div>
                    </Link>
                </div>
                {isSignedIn ? (
                    <>
                        <div className="min-h-[39.2px] font-jetBrainsMono duration-300 transition hover:bg-green-700 flex flex-row justify-center items-center border-[2px] border-solid  bg-green-600 text-white/90 text-black rounded-full pl-1 pr-4 py-1 gap-2 text-sm">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <p className="">{user?.username}</p>
                        </div>
                        <SignedOut>
                            <SignedIn />
                        </SignedOut>
                    </>
                ) : (
                    <>
                        <div className="flex flex-row justify-center gap-3 items-center">
                            <Link
                                href={'/sign-up'}
                                className="font-jetBrainsMono gap-2  transition flex flex-row text-sm justify-center  bg-green-500 hover:bg-green-600 duration-300 hover:text-white items-center px-4 py-2  rounded-full"
                            >
                                <p>Sign up</p>
                            </Link>
                            <Link
                                href={'/sign-in'}
                                className="font-jetBrainsMono gap-2  transition flex flex-row text-sm justify-center  bg-black/60 hover:bg-black/80  hover:text-white duration-300 items-center px-4 py-2  rounded-full"
                            >
                                <p>Login</p>
                            </Link>
                        </div>
                    </>
                )}
                <Link
                    href={'https://forms.gle/ZMqw7MHcPvpB3V8w8'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="flex font-jetBrainsMono justify-center items-center gap-2 flex-row px-3 py-2 text-sm text-black hover:border-white/50 border-black/40 border-[1px] hover:bg-black/20 hover:text-white duration-300 rounded-full cursor-pointer">
                        <MessageCircleDashed size={18} />
                        Feedback
                    </div>
                </Link>
            </div>
        </>
    )
}

export default NaivgationComponent
