'use client'

import Demonstration from '@/components/demontration'
import { Progress } from '@/lunar-kit/components/progress'
import { View } from 'react-native'
import React from 'react'

const ProgressDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Progress value={50} />
      </View>
    } code={`import { Progress } from '@/components/ui/progress'

const ProgressPreview = () => {
  return (
    <Progress value={value} />
  )
}

export default ProgressPreview`}/>
  )
}

export default ProgressDemo
