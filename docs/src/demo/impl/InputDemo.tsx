'use client'

import Demonstration from '@/components/demontration'
import { Input } from '@/lunar-kit/components/input'
import { View } from 'react-native'
import React from 'react'

const InputDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Input />
      </View>
    } code={`import { Input } from '@/components/ui/input'

const InputPreview = () => {
  return (
    <Input />
  )
}

export default InputPreview`}/>
  )
}

export default InputDemo
