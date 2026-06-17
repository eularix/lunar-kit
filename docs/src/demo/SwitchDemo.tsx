'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const SwitchDemo = dynamic(() => import('./impl/SwitchDemo'), { ssr: false })

export default SwitchDemo
