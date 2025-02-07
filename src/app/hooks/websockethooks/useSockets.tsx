import { useCallback, useEffect, useState, useRef } from 'react'
import useUserCookies from '../cookies/useUser'
import { useUser } from '@clerk/nextjs'
import io from 'socket.io'
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

interface RoomData {
    username: string | null
    roomID: string
    roomInfo: Record<string, any>
    roomText: string
}

interface UserStats {
    time: number
    wpm: number
}

interface UseSocketProps {
    cursor: number
    totalCharacter: number
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
    userStats: UserStats[]
    wpm: number
}

const useSocket = ({
    cursor,
    totalCharacter,
    setIsTyping,
    userStats,
    wpm,
}: UseSocketProps) => {
    const { isSignedIn, user } = useUser()
    const generateRandomCode = useCallback((): string => {
        const letters = Array.from({ length: 4 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join('')
        const digits = Math.floor(10 + Math.random() * 90).toString()
        return letters + digits
    }, [])

    const [roomData, setRoomData] = useState<RoomData>({
        username: '',
        roomID: '',
        roomInfo: {},
        roomText: '',
    })
    const [finalState, setFinalState] = useState([])
    const [allUserStats, setUserStat] = useState<any[]>([])
    const [playerControls, setPlayerControls] = useState(false)
    const [gameState, setGameState] = useState<GameStateValue>(
        GameState.CONNECTING
    )
    const [countDown, setCountDown] = useState(0)
    const connectionRef = useRef<WebSocket | null>(null)

    // Handle WebSocket connection
    const connect = useCallback(
        (username: string) => {
            console.log('username:', username)
            const user = username
            setRoomData((prev) => ({ ...prev, username: user }))

            const URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL
                ? `wss://${
                      process.env.NEXT_PUBLIC_WEBSOCKET_URL
                  }/ws/room?username=${encodeURIComponent(user ? user : '')}`
                : `localhost:8080/ws/room?username=${encodeURIComponent(
                      user ? user : ''
                  )}`

            const ws = new WebSocket(URL)
            ws.addEventListener('open', () => {
                console.log('WebSocket connected')
                connectionRef.current = ws
            })

            ws.addEventListener('message', (event) => {
                console.log('WebSocket message received:', event.data)
            })

            ws.addEventListener('error', (error) => {
                console.error('WebSocket error:', error)
            })

            ws.addEventListener('close', (event) => {
                console.log('WebSocket closed:', event)
                connectionRef.current = null
            })

            console.log('Connecting to WebSocket...')
            window.addEventListener('beforeunload', () => {
                ws.close()
            })
            const handleOpen = () => {
                console.log('socket connected')
                connectionRef.current = ws
            }

            const handleClose = (event: CloseEvent) => {
                console.log('socket closed ', event.code)
                setGameState(GameState.CONNECTING)
                connectionRef.current = null
            }

            const handleError = (error: Event) => {
                console.log('socket error ', error)
            }

            const handleMessage = (event: MessageEvent) => {
                try {
                    const message = JSON.parse(event.data)
                    console.log('Received message:', message)

                    switch (message.type) {
                        case 'room_state':
                            setRoomData((prev) => ({
                                ...prev,
                                roomID: message.room_id,
                                roomText:
                                    message.data.text || 'Default typing text',
                                roomInfo: message.data.players,
                            }))
                            console.log('Room state:', message.data)
                            setGameState(message.data.status as GameStateValue)
                            break

                        case 'countdown':
                            setCountDown(message.data)
                            break

                        case 'game_timeout':
                            console.log('Game timeout received:', message)
                            setGameState(GameState.FINISHED)
                            break

                        case 'game_finished':
                            setUserStat(message.data)
                            console.log('Game finished Received', message.data)
                            break

                        case 'ws_final_stat':
                            console.log('Final stats received', message.data)
                            setFinalState(message.data.players)
                            break
                    }
                } catch (err) {
                    console.error('Message parsing error', err)
                }
            }

            // event listeners
            ws.onopen = handleOpen
            ws.onclose = handleClose
            ws.onerror = handleError
            ws.onmessage = handleMessage

            return () => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close()
                }
            }
        },
        [generateRandomCode]
    )

    useEffect(() => {
        if (user?.username && isSignedIn) {
            const cleanup = connect(user.username)
            return cleanup
        }
    }, [connect, user?.username, isSignedIn])

    // Toggle player ready state
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

    // Send final game results
    const sendResults = useCallback(
        (data: UserStats[], wpm: number) => {
            if (connectionRef.current && gameState === GameState.FINISHED) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'final_stats',
                        data: {
                            username: roomData.username,
                            stats: {
                                timeStats: data,
                                wpm: wpm ?? -1,
                            },
                        },
                    })
                )
                console.log('Sending final stats:', {
                    username: roomData.username,
                    stats: {
                        timeStats: data,
                        wpm: wpm ?? -1,
                    },
                })
            }
        },
        [gameState, roomData.username]
    )

    // Send cursor progress
    const sendCursorProgress = useCallback(
        (cursorIndex: number, totalCharacters: number) => {
            if (
                connectionRef.current &&
                gameState === GameState.IN_PROGRESS &&
                connectionRef.current.readyState === WebSocket.OPEN
            ) {
                connectionRef.current.send(
                    JSON.stringify({
                        type: 'progress',
                        data: {
                            currentPosition: cursorIndex,
                            totalCharacters,
                        },
                    })
                )

                // Check if typing is complete
                if (cursorIndex >= totalCharacters) {
                    setGameState(GameState.FINISHED)
                }
            }
        },
        [gameState]
    )

    const sendTimeout = useCallback(() => {
        connectionRef?.current?.send(
            JSON.stringify({
                type: 'timeout',
                username: roomData.username,
            })
        )
    }, [connectionRef, roomData.username])

    // Cursor progress effect
    useEffect(() => {
        sendCursorProgress(cursor, totalCharacter)
    }, [cursor, sendCursorProgress, totalCharacter])

    // Typing state effect
    useEffect(() => {
        if (gameState === GameState.IN_PROGRESS) {
            setIsTyping(true)
        }
    }, [gameState, setIsTyping])

    return {
        roomData,
        toggleReady,
        playerControls,
        countDown,
        gameState,
        sendCursorProgress,
        totalCharacter,
        sendResults,
        setGameState,
        sendTimeout,
        finalState,
    }
}

export default useSocket
