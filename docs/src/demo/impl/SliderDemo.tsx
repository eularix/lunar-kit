'use client'

import Demonstration from '@/components/demontration'
import { Slider } from '@/lunar-kit/components/slider'
import { View } from 'react-native'
import React from 'react'

const SliderDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Slider />
      </View>
    } code={`import { Slider } from '@/components/ui/slider'

const SliderPreview = () => {
  return (
    <Slider />
  )
}

export default SliderPreview`}/>
  )
}

export default SliderDemo
