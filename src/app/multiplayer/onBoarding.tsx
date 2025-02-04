import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

const OnBoarding = () => {
    return (
        <>
            <Dialog defaultOpen open={true}>
                <DialogContent
                    hideCloseButton={true}
                    className="font-jetBrainsMono w-fit"
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Welcome to SpeedScript
                        </DialogTitle>

                        <p>
                            Please log in to show how fast <br /> you can type.
                        </p>
                        <div className="flex flex-col px-5 gap-3">
                            <Link href={'/sign-up'}>
                                <div className="flex justify-center bg-green-400 rounded-full items-center cursor-pointer">
                                    <div className="px-3 py-1">Signup</div>
                                </div>
                            </Link>
                            <Link href={'/sign-in'}>
                                <div className="flex justify-center bg-blue-400 rounded-full items-center cursor-pointer">
                                    <div className="px-3 py-1">Login</div>
                                </div>
                            </Link>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OnBoarding
