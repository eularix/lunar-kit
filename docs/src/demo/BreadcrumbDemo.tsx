'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const BreadcrumbDemo = dynamic(() => import('./impl/BreadcrumbDemo'), { ssr: false })

export default BreadcrumbDemo
