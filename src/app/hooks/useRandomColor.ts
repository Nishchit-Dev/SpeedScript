import { useEffect, useState } from 'react'

const useRandomColor = () => {
    // New state to hold colors
    const [colors, setColors] = useState<string[]>([])

    // Function to get a unique, non-repeating random Tailwind -500 color
    function getUniqueRandomTailwind500Colors() {
        // List of Tailwind -500 colors
        const tailwind500Colors = [
            'bg-red-500',
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-emerald-500',
            'bg-teal-500',
            'bg-cyan-500',
            'bg-rose-500',
            'bg-amber-500',
            'bg-lime-500',
            'bg-fuchsia-500',
            'bg-violet-500',
            'bg-orange-500',
            'bg-sky-500',
            'bg-stone-500',
        ]

        // Shuffle the colors array to ensure random order
        const shuffledColors = [...tailwind500Colors].sort(
            () => Math.random() - 0.5
        )

        // Create a generator function to yield unique colors
        function* uniqueColorGenerator(colors: string[]) {
            for (const color of colors) {
                yield color
            }
        }

        // Create a generator instance
        const colorGenerator = uniqueColorGenerator(shuffledColors)

        // Function to get the next unique color
        return function getNextUniqueColor() {
            const { value, done } = colorGenerator.next()
            if (done) {
                throw new Error('No more unique colors available!')
            }
            return value
        }
    }

    // Function to add a new color while maintaining the size of 4

    // Example usage
    const getNextUniqueColor = getUniqueRandomTailwind500Colors()
    useEffect(() => {
        try {
            for (var i = 0; i < 4; i++) {
                const color = getNextUniqueColor() // Get a unique color
                setColors((prev) => {
                    return [...prev, color]
                }) // Add the unique color to the state
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }, [])
    useEffect(() => {
        console.log(colors)
    }, [colors])

    return { getNextUniqueColor, colors } // Return the new state and function
}

export default useRandomColor