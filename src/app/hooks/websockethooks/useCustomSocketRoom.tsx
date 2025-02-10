import { useCallback, useEffect, useState, useRef } from 'react'

interface RoomData {
    username: string
    roomID: string
    roomAdmin: string
    roomInfo: Record<string, any>
    roomText: string
    maxCapacity: number
    currentPlayers: number
}

interface UseCustomRoomProps {
    username: string
    roomId: string
}

const useCustomRoomSocket = ({ username, roomId }: UseCustomRoomProps) => {
    const [roomData, setRoomData] = useState<RoomData>({
        username: username,
        roomID: roomId,
        roomAdmin: '',
        roomInfo: {},
        roomText: '',
        maxCapacity: 0,
        currentPlayers: 0,
    })
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState('')
    const connectionRef = useRef<WebSocket | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const joinRoom = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (connectionRef.current) {
                connectionRef.current.close()
            }

            const ws = new WebSocket(
                `ws://localhost:8080/ws/room?username=${encodeURIComponent(
                    username
                )}&room_id=${roomId}`
            )

            const handleOpen = () => {
                setIsConnected(true)
                connectionRef.current = ws
                resolve(true)
            }

            const handleClose = () => {
                setIsConnected(false)
                connectionRef.current = null
            }

            const handleError = (event: Event) => {
                setError('Connection failed')
                reject(new Error('WebSocket connection failed'))
            }

            const handleMessage = (event: MessageEvent) => {
                try {
                    const message = JSON.parse(event.data)

                    switch (message.type) {
                        case 'room_state':
                            setRoomData((prev) => ({
                                ...prev,
                                roomID: message.room_id,
                                roomText: message.text || 'Default typing text',
                                roomInfo: message.data.players,
                                currentPlayers: message.data.currentPlayers,
                                maxCapacity: message.data.maxCapacity,

                                roomAdmin: message.room_admin,
                            }))
                            setIsAdmin(message.room_admin === username)
                            break

                        case 'kick_player':
                            if (message.data.message) {
                                setError(message.data.message)
                                ws.close()
                            }
                            break

                        case 'player_kicked':
                            console.log(
                                `Player ${message.data.kicked_player} was kicked by ${message.data.by_admin}`
                            )
                            break

                        case 'error':
                            setError(message.data)
                            reject(new Error(message.data))
                            break
                    }
                } catch (err) {
                    console.error('Message parsing error', err)
                }
            }

            ws.onopen = handleOpen
            ws.onclose = handleClose
            ws.onerror = handleError
            ws.onmessage = handleMessage

            window.addEventListener('beforeunload', () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close()
                }
            })
        })
    }, [username, roomId])

    const kickPlayer = useCallback(
        (playerUsername: string) => {
            console.log('kick player-->', {
                type: 'admin_action',
                data: {
                    action: 'kick',
                    target: playerUsername,
                    room_id: roomId,
                },
            })
            if (
                connectionRef.current?.readyState === WebSocket.OPEN &&
                isAdmin
            ) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'admin_action',
                        data: {
                            action: 'kick',
                            target: playerUsername,
                            room_id: roomId,
                        },
                    })
                )
            }
        },
        [isAdmin, roomId]
    )

    const updateCapacity = useCallback(
        (newCapacity: number) => {
            console.log('new capacity -->', {
                type: 'admin_action',
                data: {
                    action: 'update_capacity',
                    maxCapacity: Number(newCapacity),
                    room_id: roomId,
                    target: 'ex',
                },
            })

            if (
                connectionRef.current?.readyState === WebSocket.OPEN &&
                isAdmin
            ) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'admin_action',
                        data: {
                            action: 'update_capacity',
                            maxCapacity: Number(newCapacity),
                            room_id: roomId,
                        },
                    })
                )
            }
        },
        [isAdmin, roomId]
    )

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (connectionRef.current?.readyState === WebSocket.OPEN) {
                connectionRef.current.close()
            }
        }
    }, [])

    return {
        roomData,
        isConnected,
        error,
        isAdmin,
        kickPlayer,
        joinRoom,
        updateCapacity,
    }
}

export default useCustomRoomSocket
