'use client'
import FireAnimation from '@/app/lottieAnimation'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { Crown } from 'lucide-react'
import Link from 'next/link'

const NaivgationComponent = () => {
    const { user, isSignedIn } = useUser()
    return (
        <>
            <div className="flex flex-1 flex-row gap-3 items-center justify-end">
                <div className="font-jetBrainsMono flex flex-row gap-3 justify-center items-center">
                    {isSignedIn ? (
                        <Link href={'/multiplayer'}>
                            <div className="flex flex-row px-5 py-2 text-sm text-black bg-white hover:opacity-70 duration-300 rounded-full cursor-pointer">
                                Competitive
                                <FireAnimation />
                            </div>
                        </Link>
                    ) : (
                        <></>
                    )}
                    <Link href={'/leaderboard'}>
                        <div className="font-jetBrainsMono gap-2 flex flex-row text-sm justify-center  bg-yellow-500 items-center px-4 py-2  rounded-full">
                            <Crown size={18} />
                            <p>Leaderboard</p>
                        </div>
                    </Link>
                </div>
                {isSignedIn ? (
                    <>
                        <div className="min-h-[39.2px] font-jetBrainsMono flex flex-row justify-center items-center border-[2px] border-solid  bg-green-600 text-white/90 rounded-full pl-1 pr-4 py-1 gap-2 text-sm">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <p>{user?.username}</p>
                        </div>
                        <SignedOut>
                            <SignedIn />
                        </SignedOut>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default NaivgationComponent
