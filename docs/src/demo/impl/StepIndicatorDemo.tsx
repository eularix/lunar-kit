'use client'

import Demonstration from '@/components/demontration'
import { StepIndicator } from '@/lunar-kit/components/step-indicator'
import { View } from 'react-native'
import React from 'react'

const StepIndicatorDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <StepIndicator steps={[]} currentStep={0}          />
      </View>
    } code={`import { StepIndicator } from '@/components/ui/step-indicator'

const StepIndicatorPreview = () => {
  return (
    <StepIndicator 
            steps={STEPS}
            currentStep={currentStep}
          />
  )
}

export default StepIndicatorPreview`}/>
  )
}

export default StepIndicatorDemo
