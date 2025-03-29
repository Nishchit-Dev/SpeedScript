import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

import { JetBrains_Mono } from 'next/font/google'

import Link from 'next/link'

import { Analytics } from '@vercel/analytics/react'
import NaivgationComponent from '@/components/NavComponent'

import WhatsNewInUpdates from '@/components/WhatsNewInUpdate'
import Footer from '@/components/Footer'

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    preload: true,
    variable: '--font-jetbrains',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})

export const metadata: Metadata = {
    title: 'SpeedScript🚀 – Real-Time Multiplayer Typing Platform ',
    description:
        'SpeedScript is a real-time multiplayer typing game designed to boost typing speed and accuracy. Compete with friends, join live typing races, and track your progress with detailed stats. Powered by Go and socket-based real-time communication, SpeedScript delivers a seamless and engaging online typing experience. Perfect for fast typists, keyboard enthusiasts, and anyone looking to improve their typing skills! 🚀⌨️',
}

const Layout = () => {
    return (
        <head>
            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta
                name="title"
                content="SpeedScript  Multiplayer Typing Game & Speed Test"
            />
            <meta
                name="description"
                content="⚡ Compete in real-time typing races with friends! Improve your speed, accuracy, and WPM with SpeedScript’s interactive multiplayer typing experience."
            />
            <meta
                name="keywords"
                content="typing test, multiplayer typing, speed typing, WPM test, real-time typing, typing challenge, competitive typing"
            />
            <meta name="author" content="SpeedScript Team" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://speedscript.com/" />
            <meta
                property="og:title"
                content="SpeedScript  Multiplayer Typing Game & Speed Test"
            />
            <meta
                property="og:description"
                content="⚡ Compete in real-time typing races with friends! Improve your speed, accuracy, and WPM with SpeedScript’s interactive multiplayer typing experience."
            />
            <meta
                property="og:image"
                content="https://speedscript.com/og-image.jpg"
            />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content="https://speedscript.com/" />
            <meta
                name="twitter:title"
                content="SpeedScript  Multiplayer Typing Game & Speed Test"
            />
            <meta
                name="twitter:description"
                content="⚡ Compete in real-time typing races with friends! Improve your speed, accuracy, and WPM with SpeedScript’s interactive multiplayer typing experience."
            />
            <meta
                name="twitter:image"
                content="https://speedscript.com/twitter-image.jpg"
            />

            <title>SpeedScript Multiplayer Typing Game & Speed Test</title>
        </head>
    )
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <Analytics />
            <html lang="en" suppressHydrationWarning>
                <head>
                    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                    {/* Alternative for better compatibility */}
                    <link rel="icon" href="/favicon.ico" sizes="any" />
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-2C0LWZS558"
                    ></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-2C0LWZS558');
                        `,
                        }}
                    />
                </head>

                <body
                    className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMono.variable} antialiased bg-[#E1E1E3] `}
                    cz-shortcut-listen="true"
                >
                    <div className="flex flex-1 justify-between items-center p-3 px-10 ">
                        <div className="flex flex-[0.1]"></div>

                        <div className="flex flex-[0.6] md:flex-[0.8] lg:flex-[0.6] flex-row justify-evenly  items-center gap-5 cursor-pointer">
                            <Link href={'/'}>
                                <p className="text-4xl font-jetBrainsMono italic font-semibold">
                                    SpeedScript
                                    <span className="text-green-400">.</span>
                                </p>
                            </Link>
                            <div className="flex flex-1">
                                <NaivgationComponent />
                            </div>
                        </div>
                        <div className="flex flex-[0.1]">
                            <WhatsNewInUpdates />
                        </div>
                    </div>
                    <div className="py-10  ">{children}</div>
                    {/* <Footer /> */}
                </body>
            </html>
        </ClerkProvider>
    )
}
