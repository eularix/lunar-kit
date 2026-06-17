'use client'

import Demonstration from '@/components/demontration'
import { Text } from '@/lunar-kit/components/text'
import { View } from 'react-native'
import React from 'react'

const TextDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Text />
      </View>
    } code={`import { Text } from '@/components/ui/text'

const TextPreview = () => {
  return (
    <Text />
  )
}

export default TextPreview`}/>
  )
}

export default TextDemo
