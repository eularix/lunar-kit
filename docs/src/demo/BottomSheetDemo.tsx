'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const BottomSheetDemo = dynamic(() => import('./impl/BottomSheetDemo'), { ssr: false })

export default BottomSheetDemo
