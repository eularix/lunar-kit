'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const FormDemo = dynamic(() => import('./impl/FormDemo'), { ssr: false })

export default FormDemo
