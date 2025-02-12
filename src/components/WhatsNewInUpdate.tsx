'use client'
import clsx from 'clsx'
import { useState } from 'react'

type UpdateType = {
    [key: string]: {
        updates: {
            text: string
        }[]
    }
}
const UpdateJSON: UpdateType = {
    v3: {
        updates: [
            { text: 'Create a Private Room for 4' },
            { text: 'Private room for upto 100 user' },
        ],
    },
    v2: {
        updates: [
            { text: '🏆 Leaderboard: Compete & rank among top typists!' },
            { text: '🎮 Multiplayer: Real-time typing battles are here!' },
            { text: '📅 Daily Scores: Track progress & achievements!' },
            { text: '🛡️ Badges: Earn rewards for milestones!' },
            { text: '🚀 Smoother Multiplayer & improved typing!' },
            { text: '👻 Enhanced Ghost-Cursor for seamless tracking!' },
        ],
    },
    v1: {
        updates: [
            { text: '✅ Fixed signup issues for smooth onboarding!' },
            { text: '✨ Improved single-player for better performance!' },
            { text: '🎨 Fresh styles & punctuation modes added!' },
            { text: '👻 Ghost-Cursor: Track typing progress easily!' },
        ],
    },
}
const WhatsNewInUpdates = () => {
    const [overLayredFlag, setFlag] = useState(true)
    return (
        <div className="">
            <div className="relative ">
                <div className="relative ">
                    <div>
                        <div
                            onMouseEnter={() => {
                                setFlag(false)
                            }}
                            onMouseLeave={() => {
                                setFlag(true)
                            }}
                            className="rounded-full w-min right-0 relative cursor-pointer text-black hover:border-white/50 border-black/40 border-[1px] hover:bg-black/20 hover:text-white duration-300 font-jetBrainsMono px-[14px] py-[6px] z-[100]"
                        >
                            <p>?</p>
                        </div>
                        <div
                            className={clsx(
                                `absolute block right-1 bg-white w-72 mt-3 rounded-lg px-4 py-4 font-jetBrainsMono text-sm   transition duration-300 z-[100]`,
                                { hidden: overLayredFlag },
                                { 'block ': !overLayredFlag },
                                {
                                    'opacity-100': !overLayredFlag,
                                }
                            )}
                        >
                            {Object.keys(UpdateJSON).map((version) => (
                                <div key={version}>
                                    <h3 className="font-bold">
                                        {version}
                                        <span
                                            className={clsx(
                                                'text-xs font-medium',
                                                {
                                                    'text-yellow-500 ':
                                                        version == 'v3',
                                                    'text-green-500 ':
                                                        version == 'v2',
                                                    'text-gray-400 ':
                                                        version == 'v1',
                                                }
                                            )}
                                        >
                                            {version == 'v3'
                                                ? ' progressing'
                                                : version == 'v2'
                                                ? ' latest'
                                                : ' old'}
                                        </span>
                                    </h3>
                                    {UpdateJSON[version].updates.map(
                                        (update, index) => (
                                            <div
                                                key={index}
                                                className="pl-6 mb-2"
                                            >
                                                <p className="text-sm text-black/70">
                                                    {update.text}
                                                </p>
                                                {index <
                                                    UpdateJSON[version].updates
                                                        .length -
                                                        1 && (
                                                    <div className="flex flex-1 bg-black/20 w-full h-[1px] my-1"></div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className={clsx(
                            'bg-transparent w-full h-screen left-0 backdrop-blur-sm z-50 top-0 fixed transition-opacity duration-300',
                            {
                                'opacity-0 pointer-events-none': overLayredFlag,
                                'opacity-100': !overLayredFlag,
                            }
                        )}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default WhatsNewInUpdates
