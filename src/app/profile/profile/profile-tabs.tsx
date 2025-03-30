'use client'
import { getBadgeImage } from '@/components/BadgeComponent'
import Counter from '@/components/ui/countingNumberAnimation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import ShinyText from '../animate/shinyEffect'
import TimexWpm from '../graph/profileGraph'
import { useEffect, useState } from 'react'

const HighestWpm = ({ profile }: { profile: any }) => {
    return (
        <div className="flex flex-col flex-wrap gap-5 justify-center items-center ">
            <h3 className="text-3xl">
                <span className="text-green-500 font-bold mr-2">*</span>Highest
                WPM
            </h3>
            <div className="flex gap-2 flex-row w-max">
                <div className="bg-gray-300 flex flex-col items-center  w-full p-5 rounded-md">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.highestWpm.highestScore10s
                            )}`}
                            alt="Profile"
                        />
                        <Counter number={profile.highestWpm.highestScore10s} />
                        WPM
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="10 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>
                <div className="bg-gray-300 flex flex-col items-center w-full p-5 rounded-md">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.highestWpm.highestScore30s
                            )}`}
                            alt="Profile"
                        />
                        <Counter number={profile.highestWpm.highestScore30s} />
                        WPM
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="30 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>

                <div className="bg-gray-300 flex flex-col items-center w-full p-5 rounded-md">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.highestWpm.highestScore60s
                            )}`}
                            alt="Profile"
                        />
                        <Counter number={profile.highestWpm.highestScore60s} />
                        WPM
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="60 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>
                <div className="bg-gray-300 flex flex-col items-center w-full p-5  rounded-md ">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.highestWpm.highestScore120s
                            )}`}
                            alt="Profile"
                        />
                        <Counter number={profile.highestWpm.highestScore120s} />
                        WPM
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="120 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const DailyHighestWpm = ({ profile }: { profile: any }) => {
    return (
        <div className="flex flex-col flex-wrap gap-5 justify-center items-center ">
            <h3 className="text-3xl">
                <span className="text-green-500 font-bold mr-2">*</span>Daily
                Highest WPM
            </h3>
            <div className="flex gap-2 flex-row w-max">
                <div className="bg-gray-300 flex flex-col items-center w-full p-5 rounded-md ">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full shadow-black "
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.dailyHighestWpm.dailyHighestScore10s
                            )}`}
                            alt="Profile"
                        />

                        <>
                            <Counter
                                number={
                                    profile.dailyHighestWpm.dailyHighestScore10s
                                }
                            />
                            WPM
                        </>
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="10 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>
                <div className="bg-gray-300 flex flex-col items-center w-full p-5 rounded-md ">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.dailyHighestWpm.dailyHighestScore30s
                            )}`}
                            alt="Profile"
                        />
                        <>
                            <Counter
                                number={
                                    profile.dailyHighestWpm.dailyHighestScore30s
                                }
                            />
                            WPM
                        </>
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="30 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>

                <div className="bg-gray-300 flex flex-col items-center w-full p-5 rounded-md ">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.dailyHighestWpm.dailyHighestScore60s
                            )}`}
                            alt="Profile"
                        />
                        <>
                            <Counter
                                number={
                                    profile.dailyHighestWpm.dailyHighestScore60s
                                }
                            />
                            WPM
                        </>
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="60 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>
                <div className="bg-gray-300 flex flex-col items-center w-full p-5 rounded-md ">
                    <p className="flex flex-col text-3xl justify-center items-center">
                        <Image
                            className="rounded-full"
                            width={200}
                            height={200}
                            src={`/throphies/badges/${getBadgeImage(
                                profile.dailyHighestWpm.dailyHighestScore120s
                            )}`}
                            alt="Profile"
                        />
                        <Counter
                            number={
                                profile.dailyHighestWpm.dailyHighestScore120s
                            }
                        />
                        WPM
                    </p>
                    <div className="flex bg-black/20 w-full h-[1px] my-2"></div>
                    <div className="bg-gray-700 py-2 px-5 border-[#353535] rounded-full">
                        <ShinyText
                            text="120 seconds"
                            disabled={false}
                            speed={3}
                            className="custom-class"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
const GraphComponent = ({ profile }: { profile: any }) => {
    const [selectedDuration, setSelectedDuration] = useState('10s')

    const handleDurationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDuration(event.target.value)
    }

    const [data, setData] = useState([])

    useEffect(() => {
        let updatedData = []
        switch (selectedDuration) {
            case '10s':
                if(profile.recentWpmScores?.scores10s?.length > 0)
                updatedData = profile.recentWpmScores.scores10s.map(
                    (score: number, index: number) => ({
                        time: index,
                        wpm: score,
                    })
                )
                break
            case '30s':
                if(profile.recentWpmScores?.scores30s?.length > 0)
                updatedData = profile.recentWpmScores.scores30s.map(
                    (score: number, index: number) => ({
                        time: index,
                        wpm: score,
                    })
                )
                break
            case '60s':
                if(profile.recentWpmScores?.scores60s?.length > 0)
                updatedData = profile.recentWpmScores.scores60s.map(
                    (score: number, index: number) => ({
                        time: index,
                        wpm: score,
                    })
                )
                break
            case '120s':
                if(profile.recentWpmScores?.scores120s?.length > 0)
                updatedData = profile.recentWpmScores.scores120s.map(
                    (score: number, index: number) => ({
                        time: index,
                        wpm: score,
                    })
                )

                break
            default:
                break
        }
        if (updatedData.length === 0) {
            updatedData = [{ time: 0, wpm: 0 }]
        }
        setData(updatedData)
        console.log(updatedData)
    }, [profile, selectedDuration])

    return (
        <div className="flex flex-col items-center w-[984px] h-[429.63px]">
            <TimexWpm data={data} timer={data.length} />
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setSelectedDuration('10s')}
                    className={`p-2 border rounded ${
                        selectedDuration === '10s'
                            ? 'bg-green-500 text-white'
                            : ''
                    }`}
                >
                    10 seconds
                </button>
                <button
                    onClick={() => setSelectedDuration('30s')}
                    className={`p-2 border rounded ${
                        selectedDuration === '30s'
                            ? 'bg-green-500 text-white'
                            : ''
                    }`}
                >
                    30 seconds
                </button>
                <button
                    onClick={() => setSelectedDuration('60s')}
                    className={`p-2 border rounded ${
                        selectedDuration === '60s'
                            ? 'bg-green-500 text-white'
                            : ''
                    }`}
                >
                    60 seconds
                </button>
                <button
                    onClick={() => setSelectedDuration('120s')}
                    className={`p-2 border rounded ${
                        selectedDuration === '120s'
                            ? 'bg-green-500 text-white'
                            : ''
                    }`}
                >
                    120 seconds
                </button>
            </div>
            <div>
                {/* Render graph based on selectedDuration */}
                <p>
                    Recent 10 Scores of Highest {selectedDuration} WPM duration
                </p>
            </div>
        </div>
    )
    return <></>
}

export const ProfileTabs = ({ profile }: { profile: any }) => {
    return (
        <>
            <Tabs
                defaultValue="HighestWpm"
                className="w-max transition-all duration-800 ease-out"
            >
                <TabsList>
                    <TabsTrigger value="HighestWpm">HighestWpm</TabsTrigger>
                    <TabsTrigger value="DailyHighestWpm">
                        DailyHighestWpm
                    </TabsTrigger>
                    <TabsTrigger value="Stats">Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="HighestWpm">
                    <HighestWpm profile={profile} />
                </TabsContent>
                <TabsContent value="DailyHighestWpm">
                    <DailyHighestWpm profile={profile} />
                </TabsContent>
                <TabsContent value="Stats">
                    <GraphComponent profile={profile} />
                </TabsContent>
            </Tabs>
        </>
    )
}
