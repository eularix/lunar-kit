'use client'

import Demonstration from '@/components/demontration'
import { Tooltip, TooltipTrigger, TooltipContent, Button, Text } from '@/lunar-kit/components'
import { View } from 'react-native'
import React from 'react'

const TooltipDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-4 items-center justify-center">
        <Tooltip>
          <TooltipTrigger>
            <Text>Hover me</Text>
          </TooltipTrigger>
          <TooltipContent>This is a tooltip</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Button with tooltip</Button>
          </TooltipTrigger>
          <TooltipContent side="top">Click for action</TooltipContent>
        </Tooltip>
      </View>
    } code={`import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Text } from '@/components/ui/text'

const TooltipPreview = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Text>Hover here</Text>
      </TooltipTrigger>
      <TooltipContent>Tooltip text</TooltipContent>
    </Tooltip>
  )
}

export default TooltipPreview`}/>
  )
}

export default TooltipDemo
