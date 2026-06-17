'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const CheckboxDemo = dynamic(() => import('./impl/CheckboxDemo'), { ssr: false })

export default CheckboxDemo
