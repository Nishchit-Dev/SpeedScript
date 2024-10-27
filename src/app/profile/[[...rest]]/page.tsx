import { UserProfile } from '@clerk/nextjs'

export default function Profile() {
    return (
        <div className="flex flex-1 justify-center items-center h-screen">
            <UserProfile routing="hash" />
        </div>
    )
}
