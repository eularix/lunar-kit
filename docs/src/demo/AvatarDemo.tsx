'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const AvatarDemo = dynamic(() => import('./impl/AvatarDemo'), { ssr: false })

export default AvatarDemo
