'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const SelectDemo = dynamic(() => import('./impl/SelectDemo'), { ssr: false })

export default SelectDemo
