'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const InputDemo = dynamic(() => import('./impl/InputDemo'), { ssr: false })

export default InputDemo
