'use client'
import CreateRoomComponents from './components/create-room-components'
import JoinRoom from './components/join-room-components'

const Room = () => {
    return (
        <div className="flex justify-center items-center font-jetBrainsMono">
            <div className="flex flex-row gap-4">
                <div>
                    <CreateRoomComponents />
                </div>
                <div className="w-[1px]  bg-black "></div>
                <div>
                    <JoinRoom />
                </div>
            </div>
        </div>
    )
}

export default Room
