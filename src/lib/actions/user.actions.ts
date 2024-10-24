'use server'

import User from '@/lib/models/user.models'
import { connect } from '@/lib/db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUser(user: any) {
    try {
        await connect()

        const newUser = await User.create(user)
        return JSON.parse(JSON.stringify(newUser))
    } catch (err) {
        console.log(err)
    }
}
