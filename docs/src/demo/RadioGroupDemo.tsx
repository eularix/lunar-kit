'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const RadioGroupDemo = dynamic(() => import('./impl/RadioGroupDemo'), { ssr: false })

export default RadioGroupDemo
