'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const CardDemo = dynamic(() => import('./impl/CardDemo'), { ssr: false })

export default CardDemo
