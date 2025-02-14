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
interface UserStats {
    time: number
    wpm: number
}

const GameState = {
    CONNECTING: 'connecting',
    WAITING: 'waiting',
    COUNTDOWN: 'countdown',
    IN_PROGRESS: 'in_progress',
    FINISHED: 'finished',
    GAME_RESET: 'game_reset',
} as const
type GameStateKey = keyof typeof GameState
type GameStateValue = (typeof GameState)[GameStateKey]

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
    const [finalState, setFinalState] = useState([])
    const [playerControls, setPlayerControls] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState('')
    const connectionRef = useRef<WebSocket | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [countDown, setCountDown] = useState(0)
    const [gameState, setGameState] = useState<GameStateValue>(
        GameState.CONNECTING
    )

    const joinRoom = useCallback(
        (username: string) => {
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
            }

            const handleClose = () => {
                setIsConnected(false)
                setGameState(GameState.CONNECTING)
                connectionRef.current = null
            }

            const handleError = (event: Event) => {
                setError('Connection failed')
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
                            setGameState(message.data.status as GameStateValue)
                            console.log(message.data)
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
                            break
                        case 'countdown':
                            setCountDown(message.data)
                            break
                        case 'ws_final_stat':
                            // console.log('Final stats received', message.data)
                            setFinalState(message.data.players)
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

            return () => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close()
                }
            }
        },
        [username, roomId]
    )

    const toggleReady = useCallback(() => {
        const newPlayerControlsState = !playerControls
        setPlayerControls(newPlayerControlsState)

        if (connectionRef.current?.readyState === WebSocket.OPEN) {
            connectionRef.current.send(
                JSON.stringify({
                    type: 'ready',
                    data: newPlayerControlsState,
                })
            )
        }
    }, [playerControls])
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

    const sendResults = useCallback(
        (data: UserStats[], wpm: number) => {
            if (connectionRef.current && gameState === GameState.FINISHED) {
                // console.log(wpm)
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'final_stats',
                        data: {
                            username: roomData.username,
                            stats: {
                                timeStats: data,
                                wpm: wpm.toString(),
                            },
                        },
                    })
                )
            }
        },
        [gameState, roomData.username]
    )

    const sendTimeout = useCallback(() => {
        connectionRef?.current?.send(
            JSON.stringify({
                type: 'timeout',
                username: roomData.username,
            })
        )
    }, [connectionRef, roomData.username])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (connectionRef.current?.readyState === WebSocket.OPEN) {
                connectionRef.current.close()
            }
        }
    }, [])

    useEffect(() => {
        if (username) {
            const join = joinRoom(username)
            console.log('joined room')
            return join
        }
    }, [username])

    return {
        roomData,
        isConnected,
        error,
        isAdmin,
        kickPlayer,
        joinRoom,
        updateCapacity,
        toggleReady,
        countDown,
        gameState,
        sendTimeout,
        setGameState,
        finalState,
        sendResults
    }
}

export default useCustomRoomSocket
