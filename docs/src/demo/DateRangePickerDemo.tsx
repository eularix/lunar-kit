'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const DateRangePickerDemo = dynamic(() => import('./impl/DateRangePickerDemo'), { ssr: false })

export default DateRangePickerDemo
