'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const DatePickerDemo = dynamic(() => import('./impl/DatePickerDemo'), { ssr: false })

export default DatePickerDemo
