'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const RadioDemo = dynamic(() => import('./impl/RadioDemo'), { ssr: false })

export default RadioDemo
