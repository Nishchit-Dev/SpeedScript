import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['img.clerk.com'],
    },
    hostname: 'img.clerk.com',
}

export default nextConfig
