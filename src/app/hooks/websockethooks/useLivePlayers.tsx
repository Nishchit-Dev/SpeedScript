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

            console.log('called the live player')

            const onMessage = (event: MessageEvent) => {
                const message = JSON.parse(event.data)
                console.log(message)
                switch (message.type) {
                    case 'global_online':
                        console.log('Global User: ', message.data)
                        setOnlinePlayer(message.data)
                        break
                    default:
                        console.log('Unknown message type:', message.type)
                }
            }

            ws.onmessage = onMessage

            return () => {
                ws.close()
                console.log('WebSocket connection closed')
            }
        }
    }, [user?.username])

    return { playersOnline }
}

export default useLivePlayer
