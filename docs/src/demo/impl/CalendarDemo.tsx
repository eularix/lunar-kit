'use client'

import Demonstration from '@/components/demontration'
import { Calendar } from '@/lunar-kit/components/calendar'
import { View } from 'react-native'
import React from 'react'

const CalendarDemo = () => {
  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Calendar
          variant="date"
        />
      </View>
    } code={`import { Calendar } from '@/components/ui/calendar'

const CalendarPreview = () => {
  return (
    <Calendar
          value={date}
          onValueChange={setDate}
          variant="date"
        />
  )
}

export default CalendarPreview`}/>
  )
}

export default CalendarDemo
