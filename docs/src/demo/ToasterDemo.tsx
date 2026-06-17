'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const ToasterDemo = dynamic(() => import('./impl/ToasterDemo'), { ssr: false })

export default ToasterDemo
