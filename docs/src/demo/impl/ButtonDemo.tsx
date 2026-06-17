'use client'

import Demonstration from '@/components/demontration'
import { Button } from '@/lunar-kit/components/button'
import { View } from 'react-native'

const ButtonDemo = () => {
  return (
    <Demonstration
      components={
        <View className="items-center justify-center gap-3 p-4 w-full">
          <View className="flex-row gap-2 flex-wrap justify-center">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </View>
          <View className="flex-row gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </View>
          <Button loading>Loading</Button>
        </View>
      }
      code={`import { Button } from '@lunar-kit/core'

export default function Example() {
  return (
    <Button variant="default">Click me</Button>
  )
}`}
    />
  )
}

export default ButtonDemo
