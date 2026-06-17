'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const TabsDemo = dynamic(() => import('./impl/TabsDemo'), { ssr: false })

export default TabsDemo
