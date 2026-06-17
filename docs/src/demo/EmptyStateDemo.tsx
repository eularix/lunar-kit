'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const EmptyStateDemo = dynamic(() => import('./impl/EmptyStateDemo'), { ssr: false })

export default EmptyStateDemo
