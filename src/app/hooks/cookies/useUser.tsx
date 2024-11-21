import { getUserIdByClerkId } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import { get } from 'http'
import { useEffect, useState } from 'react'

const useUserCookies = () => {
    const { user } = useUser()

    const USER_IDENTIFIER = 'USER'
    const [_user, setUser] = useState<any>({
        clerkId: null,
        email: null,
        username: null,
        Photo: null,
        highestWpm: 0,
    })
    const getUser = () => {
        return JSON.parse(localStorage.getItem(USER_IDENTIFIER) || '{}')
    }
    useEffect(() => {
        if (user && getUser()._id) {
            getUserIdByClerkId(user?.id).then((newUser) => {
                if (newUser) {
                    localStorage.setItem(
                        USER_IDENTIFIER,
                        JSON.stringify(newUser)
                    )
                    setUser(newUser)
                }
            })
        }
    }, [user])

    return { user: _user, getUser }
}

export default useUserCookies
