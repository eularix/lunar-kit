'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const BannerDemo = dynamic(() => import('./impl/BannerDemo'), { ssr: false })

export default BannerDemo
