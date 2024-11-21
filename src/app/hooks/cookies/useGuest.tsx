import { createUser } from '@/lib/actions/user.actions'
import { useEffect, useState } from 'react'

const useGuest = () => {
    const USER_IDENTIFIER = 'USER'
    const [user, setUser] = useState<any>({
        clerkId: null,
        email: null,
        username: null,
        Photo: null,
        highestWpm: 0,
    })

    useEffect(() => {
        const createUserGuest = async () => {
            const newUser = await createUser(user)
            localStorage.setItem(USER_IDENTIFIER, JSON.stringify(newUser))
            return newUser
        }

        if (!localStorage.getItem(USER_IDENTIFIER)) {
            createUserGuest().then((user) => {
                setUser(user)
            })
        }
    }, [])

    const getUser = () => {
        return JSON.parse(localStorage.getItem(USER_IDENTIFIER) || '{}')
    }

    useEffect(() => {
        const storedUser = getUser()
        if (storedUser) {
            setUser(storedUser)
        }
    }, [])

    return { userGuest: user, getUser }
}

export default useGuest
