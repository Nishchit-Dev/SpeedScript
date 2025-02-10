import useUserLocal from '@/app/hooks/cookies/useGuest'
import { getBadgeImage } from '@/components/BadgeComponent'
import Image from 'next/image'
import React from 'react'

type Props = {
    wpm: number
}

const GetBagdeForUser = ({ wpm }: { wpm: number }) => {
    return (
        <>
            <div>
                <Image
                    src={`/throphies/badges/${getBadgeImage(Number(wpm))}`}
                    alt={''}
                    width={250}
                    height={250}
                />
            </div>
        </>
    )
}
const UserRankingSystem = ({ wpm }: Props) => {
    return (
        <div className="mb-10">
            <div>
                <GetBagdeForUser wpm={wpm} />
            </div>
        </div>
    )
}

export default UserRankingSystem
