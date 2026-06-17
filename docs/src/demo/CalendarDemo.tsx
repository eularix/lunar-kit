'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const CalendarDemo = dynamic(() => import('./impl/CalendarDemo'), { ssr: false })

export default CalendarDemo
