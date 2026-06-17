'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const BadgeDemo = dynamic(() => import('./impl/BadgeDemo'), { ssr: false })

export default BadgeDemo
