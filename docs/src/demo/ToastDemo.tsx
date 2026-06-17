'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const ToastDemo = dynamic(() => import('./impl/ToastDemo'), { ssr: false })

export default ToastDemo
