'use client'

import Demonstration from '@/components/demontration'
import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@/lunar-kit/components/radio-group'
import { View } from 'react-native'
import React from 'react'

const RadioDemo = () => {
    const [value, setValue] = React.useState('option-one')
    return (
        <Demonstration components={
            <View className='w-full max-w-sm items-center justify-center p-4'>
                <RadioGroup value={value} onValueChange={setValue}>
                    <View className="flex-row items-center gap-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <RadioGroupLabel>Option One</RadioGroupLabel>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <RadioGroupLabel>Option Two</RadioGroupLabel>
                    </View>
                </RadioGroup>
            </View>
        } code={`import { RadioGroup, RadioGroupItem, RadioGroupLabel } from "@/components/ui/radio-group"
import { View } from "react-native"
import React from "react"

export function RadioDemo() {
  const [value, setValue] = React.useState('option-one')
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <View className="flex-row items-center gap-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <RadioGroupLabel>Option One</RadioGroupLabel>
      </View>
      <View className="flex-row items-center gap-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <RadioGroupLabel>Option Two</RadioGroupLabel>
      </View>
    </RadioGroup>
  )
}`} />
    )
}

export default RadioDemo
