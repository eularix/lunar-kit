'use client'

import Demonstration from '@/components/demontration'
import { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetTitle, BottomSheetDescription, BottomSheetDragArea, Button, Text } from '@/lunar-kit/components'
import { View } from 'react-native'
import React from 'react'

const BottomSheetDemo = () => {
  return (
    <Demonstration components={
      <View className="items-center justify-center">
        <BottomSheet snapPoints={['45%', '75%']} defaultSnapPoint={0}>
          <BottomSheetTrigger>
            <Button>Open Sheet</Button>
          </BottomSheetTrigger>

          <BottomSheetContent>
            <BottomSheetDragArea>
              <BottomSheetHeader>
                <BottomSheetTitle>Options</BottomSheetTitle>
                <BottomSheetDescription>
                  Select an option below
                </BottomSheetDescription>
              </BottomSheetHeader>
              <View className="p-4">
                <Text>Bottom sheet content here</Text>
              </View>
            </BottomSheetDragArea>
          </BottomSheetContent>
        </BottomSheet>
      </View>
    } code={`import { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetTitle, BottomSheetDragArea, Button } from '@/components/ui/bottom-sheet'

const BottomSheetPreview = () => {
  return (
    <BottomSheet snapPoints={['45%', '75%']}>
      <BottomSheetTrigger>
        <Button>Open Sheet</Button>
      </BottomSheetTrigger>

      <BottomSheetContent>
        <BottomSheetDragArea>
          <BottomSheetHeader>
            <BottomSheetTitle>Title</BottomSheetTitle>
          </BottomSheetHeader>
        </BottomSheetDragArea>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default BottomSheetPreview`}/>
  )
}

export default BottomSheetDemo
