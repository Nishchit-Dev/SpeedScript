import { useEffect, useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
    useModal,
} from '../ui/animated-modal'
import ShowGraph from '../graph/showGraph'
import { Button } from '../ui/button'
import { GlareCard } from '../ui/glare-ui'
import Counter from '../ui/countingNumberAnimation'
import useInformative from '@/app/hooks/useInformative'
import html2canvas from 'html2canvas'
import { Component } from './wpmCard'

// ... existing code ...

export default function Score({
    trigger,
    data,
    _wpm,
}: {
    trigger: boolean
    data: any
    _wpm: number
}) {
    const { open, setOpen } = useModal()
    const [wpm, setWpm] = useState(0)
    const { avgTimeToHitChar, lowestTimeToHitChar, highestTimeToHitChar } =
        useInformative(data)
    useEffect(() => {
        console.log('modal opnner -> ', trigger)
        setOpen(trigger)
        setWpm(_wpm)
    }, [trigger])
    useEffect(() => {
        console.log('wpm -> ', _wpm)
        setWpm(_wpm)
    }, [])

    const handleShareToTwitter = async () => {
        const element = document.getElementById('tweetImg')
        if (!element) return

        try {
            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 10,
                backgroundColor: null,
            })

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => resolve(blob!), 'image/png')
            })

            // Create ClipboardItem and copy to clipboard
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])

            // Show success message to user
            alert(
                'Image copied to clipboard! You can now paste it directly into Twitter.'
            )

            // Open Twitter compose window
            const tweetText = `I just scored ${wpm} WPM! 🚀 \n #SpeedScript #TypingChallenge`
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweetText
            )}`
            window.open(twitterUrl, '_blank')
        } catch (error) {
            console.error('Error sharing to Twitter:', error)
            alert('Failed to copy image. Please try again.')
        }
    }

    return (
        <Modal>
            <ModalTrigger>
                <div className=" border-green-400 px-5 py-2 border-2 rounded-full text-black/70 font-jetBrainsMono ">
                    Open Report
                </div>
            </ModalTrigger>
            <ModalBody isOpen={open}>
                <ModalContent>
                    <div className="flex flex-row mb-10 gap-10 " id="score">
                        <div className="flex flex-col">
                            <GlareCard className="flex flex-1 justify-center items-center hover:text-white/80">
                                <div
                                    className=" rounded-xl w-min text-green-400 "
                                    id="tweetImg"
                                >
                                    <div className="bg-gray-400/25">
                                        <div className="flex flex-1  p-10 pb-5 w-max rounded-xl">
                                            <div className="flex flex-col justify-center items-center ">
                                                <h1 className=" text-7xl font-jetBrainsMono font-extrabold inline-flex">
                                                    <Counter
                                                        number={Number(wpm)}
                                                    ></Counter>
                                                </h1>
                                                <p className="text-3xl font-jetBrainsMono font-semibold text-white/60">
                                                    Wpm
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="font-jetBrainsMono text-white text-center pb-3 italic">
                                                SpeedScript
                                                <span className="text-green-400">
                                                    .
                                                </span>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </GlareCard>
                            <div>
                                <div>
                                    <Button onClick={handleShareToTwitter}>
                                        Share on Twitter
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-10 ">
                            <div>
                                <Component />
                            </div>
                            <div className="">
                                <div className="font-jetBrainsMono">
                                    <h1>Average Time to Hit Character</h1>
                                    <p className="text-2xl font-bold">
                                        {avgTimeToHitChar.toFixed(2)} ms
                                    </p>
                                </div>
                                <div className="font-jetBrainsMono">
                                    <h1>Lowest Time to Hit Character</h1>
                                    <p className="text-2xl font-bold">
                                        {lowestTimeToHitChar.toFixed(2)} ms
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="font-jetBrainsMono">
                                    <h1>Highest Time to Hit Character</h1>
                                    <p className="text-2xl font-bold">
                                        {highestTimeToHitChar.toFixed(2)} ms
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 justify-center items-center">
                        <ShowGraph data={data} />
                    </div>
                </ModalContent>
            </ModalBody>
        </Modal>
    )
}
