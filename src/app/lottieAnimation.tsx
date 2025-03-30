'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const FireAnimation = () => {
    return (
        <DotLottieReact
            src="/animation/fire.lottie"
            loop
            autoplay
            className="w-[20px] h-[20px]"
        />
    )
}
export const LoadingAnimation = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <>
            {isLoading ? (
                <div className='flex flex-1 justify-center items-center '>
                    <DotLottieReact
                        src="/animation/Loading.lottie"
                        loop
                        autoplay
                        className=""
                    />
                </div>
            ) : (
                <></>
            )}
        </>
    )
}

export default FireAnimation
