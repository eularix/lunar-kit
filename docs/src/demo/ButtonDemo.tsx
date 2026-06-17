'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const ButtonDemo = dynamic(() => import('./impl/ButtonDemo'), { ssr: false })

export default ButtonDemo
