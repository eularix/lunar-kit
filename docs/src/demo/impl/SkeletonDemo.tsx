'use client'

import Demonstration from '@/components/demontration'
import { Skeleton } from '@/lunar-kit/components/skeleton'
import { View } from 'react-native'
import React from 'react'

const SkeletonDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Skeleton className="h-[100px] w-full" />
      </View>
    } code={`import { Skeleton } from '@/components/ui/skeleton'

const SkeletonPreview = () => {
  return (
    <Skeleton className="h-[100px] w-full" />
  )
}

export default SkeletonPreview`}/>
  )
}

export default SkeletonDemo
