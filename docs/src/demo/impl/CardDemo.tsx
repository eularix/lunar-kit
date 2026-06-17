'use client'

import Demonstration from '@/components/demontration'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lunar-kit/components/card'
import { View } from 'react-native'
import React from 'react'
import { Text } from '@/lunar-kit/components'

const CardDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              This is a description of the card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam exercitationem repudiandae nesciunt placeat. Unde molestias adipisci natus vitae saepe fugit ad accusantium vero eligendi, enim amet! Nihil corrupti neque eos!
            </Text>
          </CardContent>
          <CardFooter>
            <Text>
              Card Footer
            </Text>
          </CardFooter>
        </Card>
      </View>
    } code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Text } from '@/components/ui/text'

const CardPreview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description here</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>Card content goes here</Text>
      </CardContent>
      <CardFooter>
        <Text>Card footer</Text>
      </CardFooter>
    </Card>
  )
}

export default CardPreview`}/>
  )
}

export default CardDemo
