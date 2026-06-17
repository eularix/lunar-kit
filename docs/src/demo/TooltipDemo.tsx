'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const TooltipDemo = dynamic(() => import('./impl/TooltipDemo'), { ssr: false })

export default TooltipDemo
