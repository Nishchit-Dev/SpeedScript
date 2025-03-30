'use client'

import { useProfile } from '@/app/hooks/useUserProfile'
import { getBadgeImage, getProfileBadges } from '@/components/BadgeComponent'
import Image from 'next/image'
import { useEffect } from 'react'

import { ProfileTabs } from './profile/profile-tabs'
import { LoadingAnimation } from '@/app/lottieAnimation'

const ProfileComponent = ({
    clerkId,
    children,
}: {
    clerkId: string
    children: React.ReactNode
}) => {
    const { profile, loading, error } = useProfile(clerkId)

    useEffect(() => {
        console.log('Profile:', profile)
    }, [profile])

    if (loading)
        return (
            <div>
                <LoadingAnimation isLoading={true} />
            </div>
        )
    if (error) return <div>Error: {error}</div>
    if (!profile) return <div>Profile not found</div>

    return (
        <div className="flex flex-col w-full gap-6 ">
            <div className="flex items-start flex-row ">
                <div className="relative w-[100px] h-[100px] overflow-visible flex justify-center items-center">
                    <Image
                        className="absolute top-0 left-0 w-full h-full rounded-full z-0 bg-cover bg-center"
                        width={100}
                        height={100}
                        src={profile.Photo}
                        alt="Profile"
                    />

                    <div
                        className="absolute top-1/2 left-1/2 w-[150px] h-[150px] rounded-full bg-cover bg-center z-10 overflow-visible transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            backgroundImage: `url(/throphies/profile-badges/${getProfileBadges(
                                profile.highestWpm.highestScore30s
                            )})`,
                        }}
                    ></div>
                </div>

                <div className="flex items-start ml-8 flex-col ">
                    <div className="flex flex-row justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={50}
                            height={50}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.highestWpm.highestScore30s
                            )}`}
                            alt="Profile"
                        />

                        <h1 className="text-xl ">{profile.username}</h1>
                    </div>
                    <h1 className="text-sm text-black/70">{profile.email}</h1>
                </div>
            </div>

            {/* <div className="bg-black/20 w-[1px] h-[250px]"></div> */}

            <div className="flex flex-col gap-10 justify-center items-center w-max-[984px] transition-all duration-800 ease-out">
                <ProfileTabs profile={profile} />
            </div>
            <div>{children}</div>
        </div>
    )
}

export default ProfileComponent
