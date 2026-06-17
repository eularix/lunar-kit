'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const SkeletonDemo = dynamic(() => import('./impl/SkeletonDemo'), { ssr: false })

export default SkeletonDemo
