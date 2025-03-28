import { getWebSocketUrl } from '@/lib/helper'
import { useUser } from '@clerk/nextjs'
import { MessageSquare } from 'lucide-react'
import { set } from 'mongoose'
import { useCallback, useEffect, useState, useRef } from 'react'

interface PlayerData {
    isReady: boolean
    currentPosition: number
    wpm: number
    finishTime: number
    rank: number
}
interface ScoreBoardMessage {
    username: string
    wpm: number
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
    functions: {
        ResetTimer: () => void
        ResetLobby: () => void
    }
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
        wpm: number
        rank: number
        finishTime: number
        roomId: string
    }[]
    roomId: string
}

type GameStateKey = keyof typeof GameState
type GameStateValue = (typeof GameState)[GameStateKey]

const useCustomRoomSocket = ({
    username,
    roomId,
    functions,
}: UseCustomRoomProps) => {
    const [scoreBoardState, setScoreBoardState] =
        useState<ScoreBoardMessage[]>()
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
    const [userRank, setUserRank] = useState(0)
    const [playerControls, setPlayerControls] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState('')
    const connectionRef = useRef<WebSocket | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [countDown, setCountDown] = useState(0)
    const [gameState, setGameState] = useState<GameStateValue>(
        GameState.CONNECTING
    )
    const ResetRank = () => {
        setUserRank(0)
    }
    const { user } = useUser()
    // const { ws, setWs } = useWebConnectionHook({ username, roomId })
    useEffect(() => {
        if (gameState == 'waiting') {
            functions.ResetLobby()
            setCountDown(0)
        }
    }, [gameState])

    const joinRoom = useCallback(() => {
        const username = user?.username || ''
        if (username == '' || roomId == '') {
            console.log('Already connected')
        } else {
            const url = getWebSocketUrl().routes.wss.joinRoom

            if (!url) {
                console.error('NEXT_PUBLIC_WEBSOCKET_URL is not defined')
                return
            }

            const URL = `${url}?username=${encodeURIComponent(
                username
            )}&room_id=${roomId}`

            const ws = new WebSocket(URL)
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
                            if (countDown == 9) {
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
                            console.log('Admin WPM update:', message.data)
                            setScoreBoardState(message.data.playerWpmData)
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
                            setFinalState(message.data)
                            break

                        case 'game_finished':
                            setGameState(message.data.status as GameStateValue)
                            functions.ResetLobby()
                            break

                        case 'game_reset':
                            console.log('Game reset')
                            // functions.ResetTimer()
                            setCountDown(0)
                            ResetRank()
                            // setGameState(GameState.WAITING)
                            break
                        case 'player_rank_update':
                            console.log(message.data.rank)
                            setUserRank(message.data.rank)
                            break
                        case 'reseted_room':
                            setCountDown(0)
                            setGameState(GameState.WAITING)
                            functions.ResetTimer()
                            functions.ResetLobby()
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
            return () => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close()
                }
            }
        }
    }, [user?.username])

    const hasJoinedRef = useRef(false)

    useEffect(() => {
        if (username && roomId && !hasJoinedRef.current) {
            joinRoom()
            hasJoinedRef.current = true
        }
        return () => {
            if (
                connectionRef.current &&
                connectionRef.current.readyState === WebSocket.OPEN
            ) {
                connectionRef.current.close()
            }
        }
    }, [username, roomId])

    const resetConnectionState = useCallback(() => {
        if (
            connectionRef.current &&
            gameState === GameState.FINISHED &&
            isAdmin
        ) {
            // console.log(wpm)
            connectionRef.current.send(
                JSON.stringify({
                    type: 'reset_state',
                })
            )
        }
    }, [gameState, username])

    const toggleAdminRole = useCallback(async () => {
        try {
            const url = getWebSocketUrl().routes.wss.adminRole
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    room_id: roomId,
                    admin_role:
                        roomData.admin_role == 'spectator'
                            ? 'player'
                            : 'spectator',
                }),
            })

            if (!response.ok) {
                console.log(response)
                throw new Error('Failed to change admin role')
            }

            const data = await response.json()
            console.log(data)
            setRoomData((prevRoomData) => ({
                ...prevRoomData,
                admin_role: data.role,
            }))
        } catch (error) {
            console.error('Error changing admin role:', error)
        }
    }, [roomId, roomData.admin_role])

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
            console.log('send wpm update-->', wpm)
            if (
                connectionRef.current?.readyState === WebSocket.OPEN &&
                !isAdmin
            ) {
                try {
                    connectionRef.current.send(
                        JSON.stringify({
                            type: 'wpm_update',
                            data: { wpm },
                        })
                    )
                } catch (e: any) {
                    console.error('Error sending WPM update:', e.message)
                }
            } else {
                console.warn(
                    'WebSocket is not open. ReadyState:',
                    connectionRef.current?.readyState
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
            if (
                connectionRef.current?.readyState === WebSocket.OPEN &&
                !isAdmin
            ) {
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
            if (
                connectionRef.current &&
                gameState === GameState.FINISHED &&
                !isAdmin
            ) {
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
    return {
        state: {
            roomData,
            isConnected,
            error,
            isAdmin,
            countDown,
            gameState,
            userRank,
            finalState,
            scoreBoardState,
        },
        actions: {
            kickPlayer,
            updateCapacity,
            toggleReady,
            sendTimeout,
            resetConnectionState,
            setGameState,
            sendResults,
            sendWpmUpdate,
            kickPlayerByUsername,
            updateRoomCapacity,
            sendFinalStats,
            notifyTimeout,
            toggleAdminRole,
        },
    }
}

export default useCustomRoomSocket
