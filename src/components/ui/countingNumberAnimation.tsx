'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

export default function Counter({
    number,
    suffixText,
    speed = 5,
}: {
    number: number
    suffixText?: string
    speed?: number
}) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, Math.round)

    useEffect(() => {
        const animation = animate(count, number, {
            duration: speed,
        })

        return () => animation.stop()
    }, [])

    return <motion.span className="">{rounded}</motion.span>
}
