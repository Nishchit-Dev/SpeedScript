import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'

const LobbyText = ({
    characterArray,
    charactersToShow,
    numberOfCharacters,
    multiplier,
    charIndex,
    incorrectChar,
    isTyping=false,
}: {
    characterArray: string[]
    charactersToShow: number
    numberOfCharacters: number
    multiplier: number
    charIndex: number
    incorrectChar: any[]
    isTyping?: boolean
}) => {
    useEffect(() => {
        const splitIntoWordSpaceSegments = (characterArray: string[]) => {
            const segments: Array<{
                type: 'word' | 'space'
                chars: string[]
                indices: number[]
            }> = []
            let currentSegment: string[] = []
            let currentIndices: number[] = []

            characterArray.forEach((char, index) => {
                if (char === '\u2000') {
                    if (currentSegment.length > 0) {
                        segments.push({
                            type: 'word',
                            chars: currentSegment,
                            indices: currentIndices,
                        })
                        currentSegment = []
                        currentIndices = []
                    }
                    segments.push({
                        type: 'space',
                        chars: [char],
                        indices: [index],
                    })
                } else {
                    currentSegment.push(char)
                    currentIndices.push(index)
                }
            })

            if (currentSegment.length > 0) {
                segments.push({
                    type: 'word',
                    chars: currentSegment,
                    indices: currentIndices,
                })
            }

            return segments
        }
        const segments = splitIntoWordSpaceSegments(characterArray)

        const findClosestSpace = (
            characterArray: string[],
            targetIndex: number
        ) => {
            let closestSpaceIndex = targetIndex
            let minDistance = Infinity

            characterArray.forEach((char, index) => {
                if (char === '\u2000') {
                    const distance = Math.abs(index - targetIndex)
                    if (distance < minDistance) {
                        closestSpaceIndex = index
                        minDistance = distance
                    }
                }
            })
        }

        findClosestSpace(characterArray, charactersToShow)
    }, [characterArray])

    // Inside the component, generate the segments
    const [newText, setText] = useState<string[][]>([])

    useMemo(() => {
        const segments: string[][] = []
        let currentSegment: string[] = []
        let spaceCount = 0

        characterArray.forEach((char, index) => {
            currentSegment.push(char)
            if (char === '\u2000') {
                spaceCount++
            }

            if (window.innerWidth >= 1200 && spaceCount === 14) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            } else if (window.innerWidth >= 1000 && spaceCount === 10) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            } else if (
                window.innerWidth >= 768 &&
                window.innerWidth < 1200 &&
                spaceCount === 10
            ) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            } else if (window.innerWidth < 768 && spaceCount === 6) {
                segments.push([...currentSegment])
                currentSegment = []
                spaceCount = 0
            }
        })

        if (currentSegment.length > 0) {
            segments.push([...currentSegment])
        }

        setText(segments)
    }, [characterArray])

    return (
        <>
            <>
                <div
                    // style={{ transform: `translateX(-${progress}%)` }}
                    className={clsx(
                        `flex flex-1   flex-wrap w-1/2 font-jetBrainsMono justify-center items-center md:text-2xl lg:text-3xl relative left-[25%] transition duration-2000 ease-out `,
                        {
                            hidden: !isTyping,
                        }
                    )}
                >
                    {newText.map((segment, segmentIndex) => {
                        if (true) {
                            return (
                                <div
                                    key={segmentIndex}
                                    className="flex flex-row justify-start items-start font-jetBrainsMono text-gray-400 text-3xl"
                                >
                                    {segment.map((char, _charIndex) => {
                                        const globalIndex =
                                            newText
                                                .slice(0, segmentIndex)
                                                .reduce(
                                                    (acc, seg) =>
                                                        acc + seg.length,
                                                    0
                                                ) + _charIndex
                                        if (
                                            globalIndex >=
                                                numberOfCharacters *
                                                    (multiplier - 1) &&
                                            globalIndex <=
                                                numberOfCharacters * multiplier
                                        ) {
                                            return (
                                                <p
                                                    key={_charIndex}
                                                    className={clsx(
                                                        `character${globalIndex}`,
                                                        {
                                                            'text-gray-400':
                                                                globalIndex >
                                                                charIndex,
                                                        },
                                                        {
                                                            'text-black':
                                                                globalIndex <
                                                                    charIndex ||
                                                                !incorrectChar.includes(
                                                                    globalIndex
                                                                ),
                                                        },
                                                        {
                                                            'text-red-500':
                                                                globalIndex <
                                                                    charIndex &&
                                                                incorrectChar.includes(
                                                                    globalIndex
                                                                ),
                                                        },

                                                        {
                                                            'font-bold':
                                                                globalIndex ==
                                                                charIndex,
                                                            'text-3xl':
                                                                globalIndex ==
                                                                charIndex,
                                                            'text-green-500 cursorIsHere':
                                                                globalIndex ==
                                                                charIndex,
                                                        }
                                                    )}
                                                >
                                                    {char}
                                                </p>
                                            )
                                        }
                                    })}
                                </div>
                            )
                        }
                    })}
                </div>
            </>
        </>
    )
}

export default LobbyText
