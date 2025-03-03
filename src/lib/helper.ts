import { create } from 'domain'

export const calculateTimeDifferences = (timestamps: any[] = []) => {
    if (timestamps.length < 2) {
        return []
    }

    const timeDifferences = []
    let previousTime = timestamps[0].time

    for (let i = 1; i < timestamps.length; i++) {
        const currentTime = timestamps[i].time
        const difference = currentTime - previousTime
        timeDifferences.push({
            data: timestamps[i].char,
            time: difference / 1000,
        })
        previousTime = currentTime
    }

    // Set the first key press time to 0
    timeDifferences.unshift({
        data: timestamps[0].char,
        time: 0,
    })

    return timeDifferences
}

export const getUserHisotry = () => {
    const ID = 'History'

    let stringyRawData = localStorage.getItem(ID)
    let parseData = stringyRawData ? JSON.parse(stringyRawData) : []
    if (parseData.wpm && parseData.data) {
        return parseData
    } else {
        return { error: 'no user history' }
    }
}
interface WebSocketUrl {
    ws: string;
    http?: string;
    https?: string;
    routes: {
        wss: {
            joinRoom: string;
            adminRole: string;
            createRoom: string;
        };

        https: {
            joinRoom: string;
            adminRole: string;
            createRoom: string;
        };
    };
}

export const getWebSocketUrl = (): WebSocketUrl => {
    let envUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL
    if (!envUrl) {
        envUrl = 'localhost:8080'
        console.error(
            'WEBSOCKET_URL is not defined in the environment variables'
        )
    }

    if (process.env.NODE_ENV === 'production') {
        return {
            ws: `wss://${envUrl}`,
            https: `https://${envUrl}`,
            routes: {
                wss: {
                    joinRoom: `wss://${envUrl}/ws/room`,
                    adminRole: `wss://${envUrl}/api/admin/change-role`,
                    createRoom: `wss://${envUrl}/api/create-room`,
                },
                https: {
                    joinRoom: `https://${envUrl}/ws/room`,
                    adminRole: `https://${envUrl}/api/admin/change-role`,
                    createRoom: `https://${envUrl}/api/create-room`,
                },
            },
        }
    } else {
        return {
            ws: `ws://${envUrl}/ws/room`,
            http: `http://${envUrl}`,
            routes: {
                wss: {
                    joinRoom: `ws://${envUrl}/ws/room`,
                    adminRole: `ws://${envUrl}/api/admin/change-role`,
                    createRoom: `ws://${envUrl}/api/create-room`,
                },
                https: {
                    joinRoom: `http://${envUrl}/ws/room`,
                    adminRole: `http://${envUrl}/api/admin/change-role`,
                    createRoom: `http://${envUrl}/api/create-room`,
                },
            },
        }
    }
}
