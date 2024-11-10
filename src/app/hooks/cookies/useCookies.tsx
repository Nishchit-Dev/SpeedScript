import { useEffect, useState } from 'react'

export const useCookiesScore = ({
    gameover,
    wpm,
    data,
}: {
    gameover: boolean
    wpm: number
    data: any[]
}) => {
    const ID = 'History'
    const count = 'count'

    const [previousUserData, setpreviousUserData] = useState({})

    useEffect(() => {
        if (gameover) {
            let _data = {
                wpm: wpm,
                data: data,
            }
            localStorage.setItem(count, JSON.stringify(_data))
            setpreviousUserData(_data)
        }
    }, [gameover])

    return { previousUserData }
}
