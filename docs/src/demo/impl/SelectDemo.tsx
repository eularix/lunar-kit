'use client'

import Demonstration from '@/components/demontration'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/lunar-kit/components/select'
import { View } from 'react-native'
import React from 'react'

const SelectDemo = () => {
    const [value, setValue] = React.useState('')
    return (
        <Demonstration components={
            <View className='w-full max-w-sm flex items-center justify-center min-h-[300px]'>
                <Select value={value} onValueChange={setValue}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem label="Apple" value="apple" />
                        <SelectItem label="Banana" value="banana" />
                        <SelectItem label="Blueberry" value="blueberry" />
                    </SelectContent>
                </Select>
            </View>
        } code={`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import React from "react"

export function SelectDemo() {
  const [value, setValue] = React.useState('')
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem label="Apple" value="apple" />
        <SelectItem label="Banana" value="banana" />
        <SelectItem label="Blueberry" value="blueberry" />
      </SelectContent>
    </Select>
  )
}`} />
    )
}

export default SelectDemo
