'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const InputOtpDemo = dynamic(() => import('./impl/InputOtpDemo'), { ssr: false })

export default InputOtpDemo
