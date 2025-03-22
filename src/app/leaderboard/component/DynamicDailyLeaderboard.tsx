import { getBadgeImage } from "@/components/BadgeComponent";
import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";

const DynamicDailyLeaderboardComponent = ({
    index,
    data,
    duration,
    user
}: {
    index: number;
    data: any;
    duration: string;
    user:any
}) => {
    const [component, setComponent] = useState<React.ReactNode>(null);

    useEffect(() => {
        setComponent(null);
        renderComponentForDuration(duration);
    }, [duration]);

    const usernameSlicer = (userData: any) => {
        return userData.username || 'User'; // Placeholder implementation
    };


    const renderComponentForDuration = (duration: string) => {
        const scoreKey = `dailyHighestScore${duration}`;
        const score = data.dailyHighestWpm?.[scoreKey] || 0;

        if (score <= 0) return;

        const isTopThree = index < 3;
        const position = index + 1;

        let bgColorClass = '';
        if (index === 0)
            bgColorClass = 'bg-yellow-400 p-3 px-10 min-w-[512px] text-2xl';
        else if (index === 1)
            bgColorClass = 'bg-yellow-300 p-3 px-10 min-w-[462px] text-xl';
        else if (index === 2)
            bgColorClass = 'bg-yellow-200 p-3 px-10 min-w-[412px] text-lg';
        else bgColorClass = 'p-3 px-10 min-w-[412px]';

        setComponent(
            <div className={bgColorClass}>
                <div className="flex flex-1 justify-between items-center font-jetBrainsMono">
                    <div className="flex justify-center items-center gap-2">
                        {isTopThree ? (
                            <div className="bg-white rounded-full">
                                <Image
                                    src={`/throphies/LeaderboardRank${index + 1}.svg`}
                                    alt=""
                                    height={60}
                                    width={60}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-row justify-center items-center gap-5">
                                <div>{position}</div>
                                <div>
                                    <Image
                                        src={`/throphies/badges/${getBadgeImage(score)}`}
                                        alt=""
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="text-black/80" onClick={() => {}}>
                            {usernameSlicer(data)}
                        </div>

                        <div
                            className={clsx('', {
                                invisible: user?._id != data._id,
                            })}
                        >
                            <div className="px-3 py-1 bg-white/80 text-black text-xs rounded-full">
                                <p>you</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-bold">{score}</p>
                    </div>
                </div>
            </div>
        );
    };

    return <>{component}</>;
};

export default DynamicDailyLeaderboardComponent;