'use client'

import Demonstration from '@/components/demontration'
import { Avatar } from '@/lunar-kit/components/avatar'
import { View } from 'react-native'
import React from 'react'

const AvatarDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Avatar
        source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
        alt="John Doe"
        size="md"
      />
      </View>
    } code={`import { Avatar } from '@/components/ui/avatar'

const AvatarPreview = () => {
  return (
    <Avatar
        source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
        alt="John Doe"
        size="md"
      />
  )
}

export default AvatarPreview`}/>
  )
}

export default AvatarDemo
