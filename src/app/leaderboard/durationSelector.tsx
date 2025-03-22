import clsx from 'clsx'
import { useState } from 'react'

export const DurationSelector = ({
    activeDuration,
    onDurationChange,
}: {
    activeDuration: string
    onDurationChange: (duration: '10s' | '30s' | '60s' | '120s') => void
}) => {
    const durations = ['10s', '30s', '60s', '120s']
    const [_activeDuration,setActiveDuration] = useState('10s')
    return (
        <div className=" flex flex-row w-max bg-gray-600 rounded-sm  font-jetBrainsMono mb-5 gap-0">
            {durations.map((duration) => (
                <div
                    key={duration}
                    className={clsx(
                        'flex flex-row m-2  gap-2 justify-center items-center   text-center py-[3px] text-lg font-jetBrainsMono    transition duration-500 ease-out rounded-sm px-2 cursor-pointer',
                        {
                            'text-green-500':
                                _activeDuration === duration,
                        },
                        { 'text-white/70': _activeDuration !== duration }
                    )}
                    onClick={() => {
                        setActiveDuration(duration)
                        onDurationChange(
                            duration as '10s' | '30s' | '60s' | '120s'
                        )
                    }}
                >
                    <p>{duration}</p>
                </div>
            ))}
        </div>
    )
}
