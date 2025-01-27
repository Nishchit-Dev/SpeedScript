import { useCallback, useEffect, useState, useRef } from 'react'

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
    username: string
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
    // Generate random username
    const generateRandomCode = useCallback((): string => {
        const letters = Array.from({ length: 4 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join('')
        const digits = Math.floor(10 + Math.random() * 90).toString()
        return letters + digits
    }, [])

    // State management
    const [roomData, setRoomData] = useState<RoomData>({
        username: '',
        roomID: 'its_me',
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
    const connect = useCallback(() => {
        const user = generateRandomCode()
        setRoomData((prev) => ({ ...prev, username: user }))

        const URL = 'ws://localhost:8080/ws/room'
        const ws = new WebSocket(
            `${URL}?username=${encodeURIComponent(
                user
            )}&room_id=${encodeURIComponent(roomData.roomID)}`
        )

        // WebSocket event handlers
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
                            roomText:
                                message.data.text || 'Default typing text',
                            roomInfo: message.data.players,
                        }))
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
                        console.log('Game finished Recieved', message.data)
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

        // Attach event listeners
        ws.onopen = handleOpen
        ws.onclose = handleClose
        ws.onerror = handleError
        ws.onmessage = handleMessage

        // Cleanup function
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close()
            }
        }
    }, [generateRandomCode, roomData.roomID])

    // Initial connection effect
    useEffect(() => {
        const cleanup = connect()
        return cleanup
    }, [connect])

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
                room_id: roomData.roomID,
            })
        )
    }, [connectionRef, roomData.username, roomData.roomID])

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
        finalState
    }
}

export default useSocket
