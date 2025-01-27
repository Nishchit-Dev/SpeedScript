import { useEffect, useState } from 'react'

const useCursor = ({ cursor }: { cursor: Number }) => {
    const [cursorPosition, setPosition] = useState({ x: 0, y: 0 })
    useEffect(() => {
        const getPosition = () => {
            const element = document.querySelector(`.cursorIsHere`)

            const rct = element?.getBoundingClientRect()

            const x = rct?.left
            const y = rct?.top
            const scrollX =
                window.pageXOffset || document.documentElement.scrollLeft
            const scrollY =
                window.pageYOffset || document.documentElement.scrollTop
            if (x && y) setPosition({ x: x + scrollX, y: y + scrollY })
        }
        getPosition()
    }, [cursor])

    return {
        x: cursorPosition.x,
        y: cursorPosition.y,
    }
}

export default useCursor
