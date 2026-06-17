'use client'

import Demonstration from '@/components/demontration'
import { DateRangePicker, DateRangePickerContent, DateRangePickerTrigger, DateRangePickerValue } from '@/lunar-kit/components/date-range-picker'
import { View } from 'react-native'
import React from 'react'

const DateRangePickerDemo = () => {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Demonstration components={
      <View className='w-full max-w-sm flex items-center justify-center min-h-[300px]'>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onRangeChange={handleRangeChange}
        >
          <DateRangePickerTrigger className='w-full'>
            <DateRangePickerValue placeholder="Select date" />
          </DateRangePickerTrigger>
          <DateRangePickerContent />
        </DateRangePicker>
      </View>
    } code={`import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  DateRangePickerValue,
} from '@/components/ui/date-range-picker'
import React from "react"

export function DateRangePickerDemo() {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };


  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onRangeChange={handleRangeChange}
    >
      <DateRangePickerTrigger className='w-full'>
        <DateRangePickerValue placeholder="Select date" />
      </DateRangePickerTrigger>
      <DateRangePickerContent />
    </DateRangePicker>
  )
}`} />
  )
}

export default DateRangePickerDemo
