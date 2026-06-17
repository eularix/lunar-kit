'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const DropdownMenuDemo = dynamic(() => import('./impl/DropdownMenuDemo'), { ssr: false })

export default DropdownMenuDemo
