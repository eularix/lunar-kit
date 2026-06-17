'use client'

import Demonstration from '@/components/demontration'
import { Badge } from '@/lunar-kit/components/badge'
import { View } from 'react-native'
import React from 'react'

const BadgeDemo = () => {
  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Badge>New</Badge>
      </View>
    } code={`import { Badge } from '@/components/ui/badge'

const BadgePreview = () => {
  return (
    <Badge>New</Badge>
  )
}

export default BadgePreview`}/>
  )
}

export default BadgeDemo
