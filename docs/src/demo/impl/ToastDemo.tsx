'use client'

import Demonstration from '@/components/demontration'
import { Button } from '@/lunar-kit/components'
import { View } from 'react-native'
import React from 'react'
import { useToast } from '@/lunar-kit/hooks'

const ToastDemo = () => {
  const {toast} = useToast()
  return (
    <Demonstration components={
      <View className="gap-2">
        <Button
          onPress={() => toast({ title: 'Info', description: 'This is an info toast' })}
          variant="default"
        >
          Default Toast
        </Button>
        <Button
          onPress={() => toast.success('Success!', 'Operation completed')}
          variant="secondary"
        >
          Success Toast
        </Button>
        <Button
          onPress={() => toast.error('Error!', 'Something went wrong')}
          variant="destructive"
        >
          Error Toast
        </Button>
        <Button
          onPress={() => toast.warning('Warning!', 'Please check your input')}
          variant="outline"
        >
          Warning Toast
        </Button>
      </View>
    } code={`import { Button, toast } from '@lunar-kit/core'

const ToastPreview = () => {
  return (
    <Button
      onPress={() => toast({
        title: 'Hello',
        description: 'This is a toast message'
      })}
    >
      Show Toast
    </Button>
  )
}

export default ToastPreview`}/>
  )
}

export default ToastDemo
