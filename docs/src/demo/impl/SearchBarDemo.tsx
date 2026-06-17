'use client'

import Demonstration from '@/components/demontration'
import { SearchBar } from '@/lunar-kit/components/search-bar'
import { View } from 'react-native'
import React from 'react'

const SearchBarDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <SearchBar 
            placeholder="Search files..."
          />
      </View>
    } code={`import { SearchBar } from '@/components/ui/search-bar'

const SearchBarPreview = () => {
  return (
    <SearchBar 
            placeholder="Search files..."
          />
  )
}

export default SearchBarPreview`}/>
  )
}

export default SearchBarDemo
