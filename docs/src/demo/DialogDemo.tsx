'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const DialogDemo = dynamic(() => import('./impl/DialogDemo'), { ssr: false })

export default DialogDemo
