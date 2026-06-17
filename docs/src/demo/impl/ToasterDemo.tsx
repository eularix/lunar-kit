'use client'

import Demonstration from '@/components/demontration'
import { Toaster } from '@/lunar-kit/components/toaster'
import { View } from 'react-native'
import React from 'react'

const ToasterDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Toaster />
      </View>
    } code={`import { Toaster } from '@/components/ui/toaster'

const ToasterPreview = () => {
  return (
    <Toaster />
  )
}

export default ToasterPreview`}/>
  )
}

export default ToasterDemo
