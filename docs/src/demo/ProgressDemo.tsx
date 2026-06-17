'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const ProgressDemo = dynamic(() => import('./impl/ProgressDemo'), { ssr: false })

export default ProgressDemo
