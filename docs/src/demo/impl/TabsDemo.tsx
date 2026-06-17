'use client'

import Demonstration from '@/components/demontration'
import { Tabs, TabsList, TabsTrigger, TabsContent, Text } from '@/lunar-kit/components'
import { View } from 'react-native'
import React from 'react'

const TabsDemo = () => {
  const [activeTab, setActiveTab] = React.useState('tab1');

  return (
    <Demonstration components={
      <View className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>

          <TabsContent value="tab1">
            <Text>Content for tab 1</Text>
          </TabsContent>

          <TabsContent value="tab2">
            <Text>Content for tab 2</Text>
          </TabsContent>

          <TabsContent value="tab3">
            <Text>Content for tab 3</Text>
          </TabsContent>
        </Tabs>
      </View>
    } code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import React from 'react'

const TabsPreview = () => {
  const [activeTab, setActiveTab] = React.useState('tab1');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>

      <TabsContent value="tab1">
        <Text>Tab 1 content</Text>
      </TabsContent>

      <TabsContent value="tab2">
        <Text>Tab 2 content</Text>
      </TabsContent>
    </Tabs>
  )
}

export default TabsPreview`}/>
  )
}

export default TabsDemo
