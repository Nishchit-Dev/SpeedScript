import clsx from 'clsx'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ReloadButton = ({ gameOver }: { gameOver: boolean }) => {
    const router = useRouter()

    const handleReload = () => {
        router.refresh()
    }
    return (
        <>
            {gameOver ? (
                <div
                    className={clsx(
                        'm-2 bg-gray-600 py-[3px] text-lg font-jetBrainsMono hover:text-green-400 text-gray-400  transition duration-500 ease-out rounded-sm px-2 cursor-pointer'
                    )}
                    onClick={() => {
                        location.reload()
                    }}
                >
                    <div
                        className="flex flex-row gap-2 justify-center items-center"
                        onClick={handleReload}
                    >
                        <p>Play Again</p>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}

export default ReloadButton
