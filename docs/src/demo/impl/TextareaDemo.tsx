'use client'

import Demonstration from '@/components/demontration'
import { Textarea } from '@/lunar-kit/components/textarea'
import { View } from 'react-native'
import React from 'react'

const TextareaDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Textarea />
      </View>
    } code={`import { Textarea } from '@/components/ui/textarea'

const TextareaPreview = () => {
  return (
    <Textarea />
  )
}

export default TextareaPreview`}/>
  )
}

export default TextareaDemo
