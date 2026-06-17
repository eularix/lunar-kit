'use client'
import dynamic from 'next/dynamic'

// Client-only: the RN demo (reanimated worklets) can't be server-rendered.
const KeyboardAvoidingViewDemo = dynamic(() => import('./impl/KeyboardAvoidingViewDemo'), { ssr: false })

export default KeyboardAvoidingViewDemo
