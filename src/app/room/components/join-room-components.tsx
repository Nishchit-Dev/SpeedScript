const JoinRoom = () => {
    return (
        <>
            <div
                className="px-4 py-2 bg-blue-400 rounded-full cursor-pointer"
                onClick={() => {
                    // joinRoom({ username: 'test', roomCapacity: 4 })
                }}
            >
                <p>Join</p>
            </div>
        </>
    )
}

export default JoinRoom
