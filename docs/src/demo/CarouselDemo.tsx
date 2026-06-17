'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const CarouselDemo = dynamic(() => import('./impl/CarouselDemo'), { ssr: false })

export default CarouselDemo
