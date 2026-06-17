'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const SeparatorDemo = dynamic(() => import('./impl/SeparatorDemo'), { ssr: false })

export default SeparatorDemo
