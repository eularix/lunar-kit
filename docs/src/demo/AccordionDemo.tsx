'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const AccordionDemo = dynamic(() => import('./impl/AccordionDemo'), { ssr: false })

export default AccordionDemo
