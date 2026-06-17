'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const StepIndicatorDemo = dynamic(() => import('./impl/StepIndicatorDemo'), { ssr: false })

export default StepIndicatorDemo
