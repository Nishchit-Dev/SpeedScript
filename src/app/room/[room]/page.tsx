'use client'
import useCustomRoomSocket from '@/app/hooks/websockethooks/useCustomSocketRoom'
import { getBadgeImage } from '@/components/BadgeComponent'
import { get } from 'http'
import { Copy, Cross, Crosshair, CrossIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

const Room = () => {
    const route: any = useParams()
    const query = useSearchParams()

    const generateRandomCode = useCallback((): string => {
        const letters = Array.from({ length: 4 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join('')
        const digits = Math.floor(10 + Math.random() * 90).toString()
        return letters + digits
    }, [])
    useEffect(() => {}, [])
    const { joinRoom, isAdmin, kickPlayer, roomData } = useCustomRoomSocket({
        username: query?.get('username') || generateRandomCode(),
        roomId: route.room,
    })

    useEffect(() => {
        joinRoom()
    }, [])
    return (
        <div className="flex justify-center items-center font-jetBrainsMono">
            <div className="flex flex-col gap-4">
                {isAdmin && query?.get('username') === roomData.roomAdmin && (
                    <div className="flex flex-row justify-between items-center bg-gray-400  text-white py-1 rounded-full  pointer-cursor">
                        <div className=" rounded-full pl-4">
                            <p>Copy Room URL</p>
                        </div>
                        <div
                            className="bg-gray-500 rounded-full p-2 mr-1 cursor-pointer duration-300 hover:bg-gray-600"
                            onClick={() => {
                                const link =
                                    'http://localhost:3000/room/' + route.room
                                navigator.clipboard.writeText(link)
                            }}
                        >
                            <Copy size={18} />
                        </div>
                    </div>
                )}

                <div className="flex flex-row justify-between items-center bg-gray-500  text-white py-1 rounded-full  pointer-cursor">
                    <div className=" rounded-full pl-4">
                        <p> Room Code - </p>
                    </div>
                    <div
                        className="bg-gray-400 rounded-full p-2 mr-1 cursor-pointer duration-300 hover:bg-gray-500"
                        onClick={() => {
                            const link =
                                'http://localhost:3000/room/' + route.room
                            navigator.clipboard.writeText(link)
                        }}
                    >
                        {route.room}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                    {Object.keys(roomData.roomInfo).map((player, index) => (
                        <li
                            key={player}
                            className="flex justify-left items-center py-2 px-1 gap-5 "
                        >
                            <span className="font-medium text-lg">
                                {index + 1}
                            </span>

                            <Image
                                alt=""
                                src={`/throphies/badges/${getBadgeImage(
                                    115 - (index + 0) * 15
                                )}`}
                                width={50}
                                height={50}
                            />
                            <div className="flex items-center ">
                                <span className="font-medium text-lg">
                                    {player}
                                </span>
                                {player === roomData.roomAdmin && (
                                    <span className="ml-2 text-sm text-blue-500 font-medium">
                                        (Admin)
                                    </span>
                                )}
                            </div>
                            {isAdmin && player !== roomData.roomAdmin && (
                                <div className="flex justify-end flex-1">
                                    <div
                                        onClick={() => {
                                            kickPlayer(player)
                                        }}
                                        className=" bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors cursor-pointer "
                                    >
                                        <X size={14} />
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </div>
                <div className="flex justify-center items-center bg-green-400 rounded-md py-2 px-4 cursor-pointer hover:bg-green-500 duration-300">
                    <div>Ready</div>
                </div>
            </div>
        </div>
    )
}

export default Room
