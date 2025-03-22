import { getWebSocketUrl } from '@/lib/helper'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const useLivePlayer = () => {
    const { user } = useUser()
    const [playersOnline, setOnlinePlayer] = useState(0)

    useEffect(() => {
        if (user?.username) {
            const url = getWebSocketUrl().routes.wss.globalOnline
            const ws = new WebSocket(url)

            const onMessage = (event: MessageEvent) => {
                const message = JSON.parse(event.data)
                switch (message.type) {
                    case 'global_online':
                        setOnlinePlayer(message.data)
                        break
                    default:
                }
            }

            ws.onmessage = onMessage

            return () => {
                ws.close()
            }
        }
    }, [user?.username])

    return { playersOnline }
}

export default useLivePlayer
