import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { createUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error(
            'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
        )
    }

    // Get the headers
    const headerPayload = headers()
    const svix_id = (await headerPayload).get('svix-id')
    const svix_timestamp = (await headerPayload).get('svix-timestamp')
    const svix_signature = (await headerPayload).get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400,
        })
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console

    const eventType = evt.type
    if (eventType == 'user.created') {
        const { id, email_addresses, username, image_url } = evt.data


        const user = {
            clerkId: id,
            email: email_addresses?.[0]?.email_address,
            username: username,
            Photo: image_url,
        }
        if (user.email && user.username) {
            const newUser = await createUser(user)
            if (newUser) {
                ;(await clerkClient()).users.updateUserMetadata(id, {
                    publicMetadata: {
                        userId: newUser._id,
                    },
                })
            }
        return NextResponse.json({ message: 'New User Created', user: newUser })

        }

    }

    return new Response('', { status: 200 })
}
