'use client'

import Demonstration from '@/components/demontration'
import { DatePicker, DatePickerContent, DatePickerTrigger, DatePickerValue } from '@/lunar-kit/components/date-picker'
import { View } from 'react-native'
import React from 'react'

const DatePickerDemo = () => {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Demonstration components={
      <View className='w-full max-w-sm flex items-center justify-center min-h-[300px]'>
        <DatePicker
          value={date}
          onValueChange={setDate}
        >
          <DatePickerTrigger className='w-full'>
            <DatePickerValue placeholder="Select date" />
          </DatePickerTrigger>
          <DatePickerContent />
        </DatePicker>
      </View>
    } code={`import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
  DatePickerValue,
} from '@/components/ui/date-picker'
import React from "react"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <DatePicker
      value={date}
      onValueChange={setDate}
    >
      <DatePickerTrigger>
        <DatePickerValue placeholder="Select date" />
      </DatePickerTrigger>
      <DatePickerContent />
    </DatePicker>
  )
}`} />
  )
}

export default DatePickerDemo
