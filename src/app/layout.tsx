import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { JetBrains_Mono } from 'next/font/google'
import { Crown } from 'lucide-react'
import Link from 'next/link'
import FireAnimation from './lottieAnimation'
import { Analytics } from '@vercel/analytics/react'
import NaivgationComponent from '@/components/NavComponent'
import Head from 'next/head'
import WhatsNewInUpdates from '@/components/WhatsNewInUpdate'

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
    title: 'Create Next App',
    description: 'Generated by create next app',
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
                <Head>
                    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                    {/* Alternative for better compatibility */}
                    <link rel="icon" href="/favicon.ico" sizes="any" />
                </Head>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMono.variable} antialiased bg-[#E1E1E3]`}
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
                    <div className="py-10 ">{children}</div>
                </body>
            </html>
        </ClerkProvider>
    )
}
