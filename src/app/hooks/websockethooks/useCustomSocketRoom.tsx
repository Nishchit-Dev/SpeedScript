import { set } from 'mongoose'
import { useCallback, useEffect, useState, useRef } from 'react'

interface PlayerData {
    isReady: boolean
    currentPosition: number
    wpm: number
    finishTime: number
    rank: number
}

interface RoomStateMessage {
    type: 'room_state'
    data: {
        status: GameStateValue
        players: Record<string, PlayerData>
        text: string
        startTime: number
        totalCharacters: number
        maxCapacity: number
        currentPlayers: number
    }
    room_id: string
    room_admin: string
    admin_role: 'spectator' | 'player'
    time: number
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

interface finalLeaderboard {
    data: {
        playerWpmData: {
            username: string
            wpm: number
        }[]
        timestamp: string
    }
}
interface userFinalScore {
    rank: number
    wpm: number
    time: number
    username: string
    finalPosition: number
}
interface kickedPlayer {
    isKicked: boolean
    message: 'You have been kicked from the room'
    by: string
}
interface finalRoomState {
    players: {
        username: string
        stats: {
            time: number
            wpm: number
        }[]
        finalWPM: number
        rank: number
        finishTime: number
        roomId: string
    }[]
    roomId: string
}

type GameStateKey = keyof typeof GameState
type GameStateValue = (typeof GameState)[GameStateKey]

const useWebConnectionHook = ({
    username,
    roomId,
}: {
    username: string
    roomId: string
}) => {
    const [ws, setWs] = useState<WebSocket>()
    useEffect(() => {
        if (username && roomId) {
            const _ws = new WebSocket(
                `ws://localhost:8080/ws/room?username=${encodeURIComponent(
                    username
                )}&room_id=${roomId}`
            )
            setWs(_ws)
        }
    }, [username, roomId])

    return { ws, setWs }
}

const RoomCheck = async (roomId: string): Promise<boolean> => {
    try {
        const response = await fetch(`/api/check-room?room_id=${roomId}`)
        const data = await response.json()
        return data.exists
    } catch (error) {
        console.error('Error checking room existence:', error)
        return false
    }
}

const useCustomRoomSocket = ({ username, roomId }: UseCustomRoomProps) => {
    const [roomData, setRoomData] = useState<RoomStateMessage>({
        type: 'room_state',
        data: {
            status: GameState.CONNECTING,
            players: {},
            text: '',
            startTime: 0,
            totalCharacters: 0,
            maxCapacity: 0,
            currentPlayers: 0,
        },
        room_id: '',
        room_admin: '',
        admin_role: 'spectator',
        time: 0,
    })

    const [kickedPlayer, setKickedPlayer] = useState<kickedPlayer>({
        isKicked: false,
        message: 'You have been kicked from the room',
        by: '',
    })

    const [finalLeaderboard, setFinalLeaderboard] = useState<
        finalLeaderboard[]
    >([])
    const [finalUserScores, setFinalUserScores] = useState<userFinalScore>({
        rank: 0,
        wpm: 0,
        time: 0,
        username: '',
        finalPosition: 0,
    })
    const [finalState, setFinalState] = useState<finalRoomState>({
        players: [],
        roomId: '',
    })
    const [playerControls, setPlayerControls] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState('')
    const connectionRef = useRef<WebSocket | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [countDown, setCountDown] = useState(0)
    const [gameState, setGameState] = useState<GameStateValue>(
        GameState.CONNECTING
    )
    // const { ws, setWs } = useWebConnectionHook({ username, roomId })


    const joinRoom = useCallback(
        (username: string) => {
            if (connectionRef.current) {
                connectionRef.current.close()
            }

            // const exist = RoomCheck(roomId)
            // if (!exist) {
            //     setError('Room does not exist')
            //     return
            // }
            if (username != '' || roomId != '') return

            const ws = new WebSocket(
                `ws://localhost:8080/ws/room?username=${encodeURIComponent(
                    username
                )}&room_id=${roomId}`
            )
            const handleOpen = () => {
                setIsConnected(true)
                connectionRef.current = ws || null
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
                        case 'countdown':
                            setCountDown(message.data)
                            console.log(message.data)
                            if (countDown == 3) {
                                setGameState(GameState.IN_PROGRESS)
                            }
                            break

                        case 'room_state':
                            setRoomData({
                                type: 'room_state',
                                data: {
                                    status: message.data.status,
                                    players: message.data.players,
                                    text:
                                        message.data.text ||
                                        'Default typing text',
                                    startTime: message.data.startTime,
                                    totalCharacters:
                                        message.data.totalCharacters,
                                    maxCapacity: message.data.maxCapacity,
                                    currentPlayers: message.data.currentPlayers,
                                },
                                room_id: message.room_id,
                                room_admin: message.room_admin,
                                admin_role: message.admin_role,
                                time: message.time,
                            })
                            setGameState(message.data.status as GameStateValue)
                            console.log(message.data)
                            setIsAdmin(message.room_admin == username)
                            break

                        case 'admin_wpm_update':
                            setFinalLeaderboard((prevFinalLeaderboard) => {
                                const updatedLeaderboard =
                                    prevFinalLeaderboard.map((leaderboard) => {
                                        const updatedPlayerWpmData =
                                            leaderboard.data.playerWpmData.map(
                                                (player) => {
                                                    if (
                                                        roomData.data.players[
                                                            player.username
                                                        ]
                                                    ) {
                                                        return {
                                                            ...player,
                                                            wpm: roomData.data
                                                                .players[
                                                                player.username
                                                            ].wpm,
                                                        }
                                                    }
                                                    return player
                                                }
                                            )
                                        return {
                                            ...leaderboard,
                                            data: {
                                                ...leaderboard.data,
                                                playerWpmData:
                                                    updatedPlayerWpmData,
                                            },
                                        }
                                    })
                                return updatedLeaderboard
                            })
                            break

                        case 'room_capacity_updated':
                            setRoomData((prevRoomData) => ({
                                ...prevRoomData,
                                data: {
                                    ...prevRoomData.data,
                                    maxCapacity: message.data.maxCapacity,
                                },
                            }))
                            break

                        case 'kick_player':
                            if (message.data.message) {
                                if (ws) {
                                    setKickedPlayer({
                                        isKicked: true,
                                        message:
                                            'You have been kicked from the room',
                                        by: roomData.room_admin,
                                    })
                                    ws.close()
                                }
                            }
                            break

                        case 'player_kicked':
                            console.log(
                                `Player ${message.data.kicked_player} was kicked by ${message.data.by_admin}`
                            )
                            setRoomData((prevRoomData) => {
                                const updatedPlayers = {
                                    ...prevRoomData.data.players,
                                }
                                delete updatedPlayers[
                                    message.data.kicked_player
                                ]
                                return {
                                    ...prevRoomData,
                                    data: {
                                        ...prevRoomData.data,
                                        players: updatedPlayers,
                                        currentPlayers:
                                            prevRoomData.data.currentPlayers -
                                            1,
                                    },
                                }
                            })
                            break

                        case 'user_finished':
                            setFinalUserScores(message.data)
                            break

                        case 'ws_final_stat':
                            setFinalState(message.data as finalRoomState)
                            break

                        case 'ws_final_stat':
                            // console.log('Final stats received', message.data)
                            setFinalState(message.data.players)
                            break

                        case 'game_finished':
                            setGameState(message.data.status as GameStateValue)
                            break

                        case 'game_reset':
                            break

                        case 'error':
                            setError(message.data)
                            break
                    }
                } catch (err) {
                    console.error('Message parsing error', err)
                }
            }
            if (ws) {
                ws.onopen = handleOpen
                ws.onclose = handleClose
                ws.onerror = handleError
                ws.onmessage = handleMessage
            }

            // window.addEventListener('beforeunload', () => {
            //     if (ws.readyState === WebSocket.OPEN) {
            //         ws.close()
            //     }
            // })
        },
        [username, roomId]
    )

    
    useEffect(() => {
        console.log('joinning romm')
        if (username != '' && roomId != '') {
            console.log('calling function')
            joinRoom(username)
        }
    }, [username])
    const toggleReady = useCallback(() => {
        console.log(connectionRef)
        if (connectionRef.current) {
            connectionRef.current.send(
                JSON.stringify({
                    type: 'ready',
                    data: playerControls,
                })
            )
            setPlayerControls(!playerControls)
        }
    }, [playerControls])

    const sendWpmUpdate = useCallback(
        (wpm: number) => {
            if (connectionRef.current?.readyState === WebSocket.OPEN) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'wpm_update',
                        data: { wpm: wpm },
                    })
                )
            }
        },
        [connectionRef]
    )
    const kickPlayerByUsername = useCallback(
        (playerUsername: string) => {
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

    const updateRoomCapacity = useCallback(
        (newCapacity: number) => {
            if (
                connectionRef.current?.readyState === WebSocket.OPEN &&
                isAdmin
            ) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'admin_action',
                        data: {
                            action: 'update_capacity',
                            maxCapacity: newCapacity,
                            room_id: roomId,
                        },
                    })
                )
            }
        },
        [isAdmin, roomId]
    )

    const sendFinalStats = useCallback(
        (stats: UserStats[], wpm: number) => {
            if (connectionRef.current?.readyState === WebSocket.OPEN) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'final_stats',
                        data: {
                            stats: {
                                wpm: wpm.toString(),
                                timeStats: stats,
                            },
                        },
                    })
                )
            }
        },
        [connectionRef]
    )

    const notifyTimeout = useCallback(() => {
        if (connectionRef.current?.readyState === WebSocket.OPEN) {
            connectionRef.current.send(
                JSON.stringify({
                    type: 'timeout',
                })
            )
        }
    }, [connectionRef])

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
                            username: username,
                            stats: {
                                timeStats: data,
                                wpm: wpm.toString(),
                            },
                        },
                    })
                )
            }
        },
        [gameState, username]
    )

    const sendTimeout = useCallback(() => {
        connectionRef?.current?.send(
            JSON.stringify({
                type: 'timeout',
                username: username,
            })
        )
    }, [connectionRef, username])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (connectionRef.current?.readyState === WebSocket.OPEN) {
                connectionRef.current.close()
            }
        }
    }, [])

    // useEffect(() => {
    //     if (username) {
    //         const join = joinRoom(username)
    //         console.log('joined room')
    //         return join
    //     }
    // }, [username])

    return {
        state: {
            roomData,
            isConnected,
            error,
            isAdmin,
            countDown,
            gameState,
            finalState,
        },
        actions: {
            kickPlayer,
            joinRoom,
            updateCapacity,
            toggleReady,
            sendTimeout,
            setGameState,
            sendResults,
            sendWpmUpdate,
            kickPlayerByUsername,
            updateRoomCapacity,
            sendFinalStats,
            notifyTimeout,
        },
    }
}

export default useCustomRoomSocket
