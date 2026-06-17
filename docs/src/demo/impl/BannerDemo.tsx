'use client'

import Demonstration from '@/components/demontration'
import { Banner } from '@/lunar-kit/components/banner'
import { View } from 'react-native'
import React from 'react'

const BannerDemo = () => {
  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Banner
          title="Information"
          description="This is an informational message."
        />
      </View>
    } code={`import { Banner } from '@/components/ui/banner'

const BannerPreview = () => {
  return (
    <Banner
          title="Information"
          description="This is an informational message."
        />
  )
}

export default BannerPreview`}/>
  )
}

export default BannerDemo
