'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const SliderDemo = dynamic(() => import('./impl/SliderDemo'), { ssr: false })

export default SliderDemo
