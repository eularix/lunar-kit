'use client'

import Demonstration from '@/components/demontration'
import { Switch } from '@/lunar-kit/components/switch'
import { View } from 'react-native'
import React from 'react'
import { Text, useToolbar } from '@lunar-kit/core'

const SwitchDemo = () => {
  const [airplaneMode, setAirplaneMode] = React.useState(false);

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Switch
            checked={airplaneMode}
            onCheckedChange={setAirplaneMode}
          />
      </View>
    } code={`import { Switch } from '@/components/ui/switch'

const SwitchPreview = () => {
  return (
    <Switch
            checked={airplaneMode}
            onCheckedChange={setAirplaneMode}
          />
  )
}

export default SwitchPreview`}/>
  )
}

export default SwitchDemo
