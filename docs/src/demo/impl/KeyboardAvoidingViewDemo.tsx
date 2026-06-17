'use client'

import Demonstration from '@/components/demontration'
import { KeyboardAvoidingView } from '@/lunar-kit/components/keyboard-avoiding-view'
import { View } from 'react-native'
import React from 'react'
import { Button, Input, Text } from '@/lunar-kit/components'

const KeyboardAvoidingViewDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <KeyboardAvoidingView
      className="flex-1 bg-background"
      extraScrollHeight={32}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <View className="gap-2 mb-4">
        <Text className="text-2xl font-bold text-foreground">
          Keyboard Avoiding View
        </Text>
        <Text className="text-sm text-foreground/60">
          Custom ScrollView-based keyboard avoidance. Tap any input below
          — the view will automatically scroll so the keyboard never covers
          your input.
        </Text>
      </View>

      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Full Name</Text>
          <Input placeholder="Enter your full name" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Email</Text>
          <Input
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Phone</Text>
          <Input
            placeholder="+62 xxx-xxxx-xxxx"
            keyboardType="phone-pad"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Address Line 1</Text>
          <Input placeholder="Street address" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Address Line 2</Text>
          <Input placeholder="Apt, suite, etc." />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">City</Text>
          <Input placeholder="City name" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Zip Code</Text>
          <Input
            placeholder="12345"
            keyboardType="number-pad"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Notes</Text>
          <Input
            placeholder="Any additional notes..."
            multiline
          // numberOfLines={4}
          // style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        </View>

        <Button className="mt-4">
          Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
      </View>
    } code={`import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view'

const KeyboardAvoidingViewPreview = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      extraScrollHeight={32}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <View className="gap-2 mb-4">
        <Text className="text-2xl font-bold text-foreground">
          Keyboard Avoiding View
        </Text>
        <Text className="text-sm text-foreground/60">
          Custom ScrollView-based keyboard avoidance. Tap any input below
          — the view will automatically scroll so the keyboard never covers
          your input.
        </Text>
      </View>

      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Full Name</Text>
          <Input placeholder="Enter your full name" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Email</Text>
          <Input
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Phone</Text>
          <Input
            placeholder="+62 xxx-xxxx-xxxx"
            keyboardType="phone-pad"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Address Line 1</Text>
          <Input placeholder="Street address" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Address Line 2</Text>
          <Input placeholder="Apt, suite, etc." />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">City</Text>
          <Input placeholder="City name" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Zip Code</Text>
          <Input
            placeholder="12345"
            keyboardType="number-pad"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Notes</Text>
          <Input
            placeholder="Any additional notes..."
            multiline
          // numberOfLines={4}
          // style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        </View>

        <Button className="mt-4">
          Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

export default KeyboardAvoidingViewPreview`}/>
  )
}

export default KeyboardAvoidingViewDemo
