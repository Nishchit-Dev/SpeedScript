import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const useUserLocal = () => {
    const USER_IDENTIFIER = 'USER'
    const [user, setUser] = useState<any>({
        clerkId: null,
        email: null,
        username: null,
        Photo: null,
        highestWpm: 0,
    })
    const { user: clerkUser }: { user: any } = useUser()

    useEffect(() => {
        if (clerkUser?.id) {
            getUserIdByClerkId(clerkUser?.id).then((newUser: any) => {
                if (newUser) {
                    localStorage.setItem(
                        USER_IDENTIFIER,
                        JSON.stringify(newUser)
                    )
                    setUser(newUser)
                }
            })
        }
    }, [clerkUser])

    const getUser = () => {
        const userdata = localStorage.getItem(USER_IDENTIFIER) || ''
        if (userdata) {
            return JSON.parse(userdata)
        } else {
            return null
        }
    }

    useEffect(() => {
        const storedUser = getUser()
        if (storedUser) {
            setUser(storedUser)
        }
    }, [clerkUser])

    return { userGuest: user, getUser }
}

export default useUserLocal
