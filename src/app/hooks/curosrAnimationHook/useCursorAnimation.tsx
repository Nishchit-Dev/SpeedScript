import { useEffect, useState } from 'react'

const useCursor = ({ cursor }: { cursor: Number }) => {
    const [cursorPosition, setPosition] = useState({ x: 0, y: 0 })
    useEffect(() => {
        const getPosition = () => {
            const element = document.querySelector(`.cursorIsHere`)

            const rct = element?.getBoundingClientRect()

            const x = rct?.left
            const y = rct?.top
            console.log(x, y)
            if (x && y) setPosition({ x: x, y: y })
        }
        getPosition()
    }, [cursor])

    return {
        x: cursorPosition.x,
        y: cursorPosition.y,
    }
}

export default useCursor
