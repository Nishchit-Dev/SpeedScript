import { useCallback, useEffect, useState } from 'react'

const GameState = {
    CONNECTING: 'connecting',
    WAITING: 'waiting',
    COUNTDOWN: 'countdown',
    IN_PROGRESS: 'in_progress',
    FINISHED: 'finished',
    GAME_RESET: 'game_reset',
}

const useSocket = ({
    cursor,
    totalcharacter,
    setIsTyping,
}: {
    cursor: number
    totalcharacter: number
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    function generateRandomCode() {
        // Generate 4 random letters
        const letters = Array.from(
            { length: 4 },
            () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
        ).join('')

        // Generate 2 random digits
        const digits = Math.floor(10 + Math.random() * 90).toString() // 10-99

        return letters + digits
    }
    const [roomData, setRoomData] = useState({
        username: '',
        roomID: 'its_me',
        roomInfo: {},
        roomText: '',
    })
    const [text, setText] = useState('')
    const [playerControls, setPlayerControls] = useState(false)
    const [gameState, setGameState] = useState(GameState.CONNECTING)
    const [countDown, setCountDown] = useState(0)
    const [playerProgress, setPlayerProgress] = useState({
        x: 0,
        y: 0,
    })
    const [connection, setConnection] = useState<WebSocket>()

    const connect = useCallback(() => {
        let user = generateRandomCode()
        setRoomData((prev) => {
            return { ...prev, username: user }
        })

        const URL = 'ws://localhost:8080/ws/room'
        const ws = new WebSocket(
            `${URL}?username=${encodeURIComponent(
                user
            )}&room_id=${encodeURIComponent(roomData.roomID)}`
        )

        ws.onopen = () => {
            console.log('socket connected')
            setConnection(ws)
        }

        ws.onclose = (event) => {
            console.log('socket closed ', event.code)
            setGameState(GameState.CONNECTING)
        }

        ws.onerror = (error) => {
            console.log('socket error ', error)
        }

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data)

                switch (message.type) {
                    case 'room_state':
                        console.log('room_state', message.data)
                        setRoomData((prev) => {
                            return {
                                ...prev,
                                roomText:
                                    message.data.text ||
                                    'no data is passed in this variable so user will need to type this shit out of nowhere i hope you understand this',
                            }
                        })
                        setGameState(message.data.status)
                        setRoomData((prev) => {
                            return { ...prev, roomInfo: message.data.players }
                        })
                        break
                    case 'countdown':
                        console.log(message.data)

                        setCountDown(message.data)
                        break
                }
            } catch (err) {
                console.log('err ', err)
            }
        }

        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close()
            }
        }
    }, [roomData])

    useEffect(() => {
        connect()
    }, [])
    const toggleReady = () => {
        setPlayerControls(!playerControls)
        if (connection && connection.readyState == WebSocket.OPEN) {
            connection.send(
                JSON.stringify({
                    type: 'ready',
                    data: !playerControls,
                })
            )
        }
    }

    const sendCursorProgress = (
        cursorIndex: Number,
        totalCharacters: Number
    ) => {
        console.log('sending progess')
        if (
            connection &&
            GameState.IN_PROGRESS == gameState &&
            connection.readyState == WebSocket.OPEN
        ) {
            console.log('passed the condition progess')

            connection.send(
                JSON.stringify({
                    type: 'progress',
                    data: {
                        currentPosition: cursorIndex,
                        totalCharacters,
                    },
                })
            )
        }

        if (cursorIndex >= totalCharacters) {
            setGameState(GameState.FINISHED)
        }
    }

    useEffect(() => {
        sendCursorProgress(cursor, totalcharacter)
    }, [cursor])

    useEffect(() => {
        if (gameState == GameState.IN_PROGRESS) {
            setIsTyping(true)
        }
    }, [gameState])

    return {
        roomData,
        toggleReady,
        playerControls,
        countDown,
        gameState,
        sendCursorProgress,
    }
}

export default useSocket
