'use server'

import User from '@/lib/models/user.models'
import { connect } from '@/lib/db'

export async function createUser(user: any) {
    try {
        const res = await connect()
        console.log(res)
        const newUser = await User.create(user)
        return JSON.parse(JSON.stringify(newUser))
    } catch (err) {
        console.log(err)
    }
}
