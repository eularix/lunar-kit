'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const TextDemo = dynamic(() => import('./impl/TextDemo'), { ssr: false })

export default TextDemo
