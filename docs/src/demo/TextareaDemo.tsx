'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const TextareaDemo = dynamic(() => import('./impl/TextareaDemo'), { ssr: false })

export default TextareaDemo
