'use client'

import Demonstration from '@/components/demontration'
import { InputOTP, Text } from '@/lunar-kit/components'
import { View } from 'react-native'
import React from 'react'

const InputOtpDemo = () => {
  const [otp, setOtp] = React.useState('');

  return (
    <Demonstration components={
      <View className="gap-8 items-center justify-center">
        <View className="gap-4 items-center">
          <Text>4-Digit OTP</Text>
          <InputOTP maxLength={4} onValueChange={setOtp} />
          <Text className="text-muted-foreground">Value: {otp}</Text>
        </View>

        <View className="gap-4 items-center">
          <Text>6-Digit PIN (Password)</Text>
          <InputOTP maxLength={6} inputType="password" />
        </View>
      </View>
    } code={`import { InputOTP } from '@/components/ui/input-otp'
import React from 'react'

const InputOtpPreview = () => {
  const [otp, setOtp] = React.useState('');

  return (
    <InputOTP
      maxLength={6}
      onValueChange={setOtp}
    />
  )
}

export default InputOtpPreview`}/>
  )
}

export default InputOtpDemo
