'use client'

import { useRouter } from 'next/navigation'

const CreateRoomComponents = () => {
    const router = useRouter()
    const handleCreateRoom = async ({
        username,
        roomCapacity,
    }: {
        username: string
        roomCapacity: number
    }) => {
        if (!username) {
            throw new Error('Username is required')
        }

        try {
            const response = await fetch(
                'http://localhost:8080/api/create-room',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        maxCapacity: Number(roomCapacity),
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to create room')
            }

            const data = await response.json()

            router.push(`/room/${data.room_id}?username=${username}`)
        } catch (err) {
            throw new Error('Failed to create room. Please try again.')
        }
    }

    return (
        <>
            <div>
                <div
                    className="px-4 py-2 bg-green-400 rounded-full cursor-pointer"
                    onClick={() => {
                        handleCreateRoom({
                            username: '0xAdmin',
                            roomCapacity: 4,
                        })
                    }}
                >
                    Create Room
                </div>
            </div>
        </>
    )
}
export default CreateRoomComponents
