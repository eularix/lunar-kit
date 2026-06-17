'use client'

import Demonstration from '@/components/demontration'
import { Alert } from '@/lunar-kit/components/alert'
import { View } from 'react-native'
import React from 'react'

const AlertDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Alert variant="default">
          This is a default alert for general information.
        </Alert>
      </View>
    } code={`import { Alert } from '@/components/ui/alert'

const AlertPreview = () => {
  return (
    <Alert variant="default">
          This is a default alert for general information.
        </Alert>
  )
}

export default AlertPreview`}/>
  )
}

export default AlertDemo
