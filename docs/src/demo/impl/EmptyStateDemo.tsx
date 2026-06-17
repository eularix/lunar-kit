'use client'

import Demonstration from '@/components/demontration'
import { EmptyState } from '@/lunar-kit/components/empty-state'
import { View } from 'react-native'
import React from 'react'
import { Inbox } from 'lucide-react-native'

const EmptyStateDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <EmptyState
            title="No messages yet"
            description="Your inbox is empty. Start a conversation with someone!"
            illustration={<Inbox size={48} color="#94a3b8"/>} />
      </View>
    } code={`import { EmptyState } from '@/components/ui/empty-state'

const EmptyStatePreview = () => {
  return (
    <EmptyState
            title="No messages yet"
            description="Your inbox is empty. Start a conversation with someone!"
            illustration={<Inbox size={48} color="#94a3b8"/>} />
  )
}

export default EmptyStatePreview`}/>
  )
}

export default EmptyStateDemo
