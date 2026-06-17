'use client'

import Demonstration from '@/components/demontration'
import { SelectSheet } from '@/lunar-kit/components/select-sheet'
import { View } from 'react-native'
import React from 'react'

const SelectSheetDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <SelectSheet
            label="Country"
            placeholder="Select a country..."
            options={[
              { label: 'Indonesia', value: 'id' },
              { label: 'United States', value: 'us' },
              { label: 'United Kingdom', value: 'uk' },
              { label: 'Japan', value: 'jp' },
              { label: 'Singapore', value: 'sg' },
            ]}
            searchable
          />
      </View>
    } code={`import { SelectSheet } from '@/components/ui/select-sheet'

const SelectSheetPreview = () => {
  return (
    <SelectSheet
            label="Country"
            placeholder="Select a country..."
            options={[
              { label: 'Indonesia', value: 'id' },
              { label: 'United States', value: 'us' },
              { label: 'United Kingdom', value: 'uk' },
              { label: 'Japan', value: 'jp' },
              { label: 'Singapore', value: 'sg' },
            ]}
            searchable
          />
  )
}

export default SelectSheetPreview`}/>
  )
}

export default SelectSheetDemo
