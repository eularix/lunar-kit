'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const SelectSheetDemo = dynamic(() => import('./impl/SelectSheetDemo'), { ssr: false })

export default SelectSheetDemo
