'use client'

import Demonstration from '@/components/demontration'
import { Carousel } from '@/lunar-kit/components/carousel'
import { Dimensions, Image, View } from 'react-native'
import React from 'react'

const CarouselDemo = () => {
  const IMAGES = [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000',
  ];
  const SCREEN_WIDTH = Dimensions.get('window').width;

  return (
    <Demonstration components={
      <View>
        <Carousel
            data={IMAGES}
            renderItem={({ item }) => (
              <View
                className="overflow-hidden rounded-2xl bg-muted"
                style={{ width: SCREEN_WIDTH - 64, height: 250 }}
              >
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
      </View>
    } code={`import { Carousel } from '@/components/ui/carousel'
import { Image, View, Dimensions } from 'react-native'

const CarouselPreview = () => {
  const data = ['url1', 'url2', 'url3'];
  const width = Dimensions.get('window').width;

  return (
    <Carousel
      data={data}
      renderItem={({ item }) => (
        <View style={{ width: width - 64, height: 250 }}>
          <Image source={{ uri: item }} />
        </View>
      )}
    />
  )
}

export default CarouselPreview`}/>
  )
}

export default CarouselDemo
