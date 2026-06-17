'use client'

import Demonstration from '@/components/demontration'
import { Breadcrumb } from '@/lunar-kit/components/breadcrumb'
import { View } from 'react-native'
import React from 'react'
import { useToast } from '@/lunar-kit/hooks'

const BreadcrumbDemo = () => {
  const {toast} = useToast()
   return (
    <Demonstration components={
      <View>
        <Breadcrumb 
            items={[
              { label: 'Home', onPress: () => toast.info('Home') },
              { label: 'Products', onPress: () => toast.info('Products') },
              { label: 'Details' }
            ]}
          />
      </View>
    } code={`import { Breadcrumb } from '@/components/ui/breadcrumb'

const BreadcrumbPreview = () => {
  return (
     <Breadcrumb 
        items={[
          { label: 'Home', onPress: () => toast.info('Home') },
          { label: 'Products', onPress: () => toast.info('Products') },
          { label: 'Details' }
        ]}
      />
  )
}

export default BreadcrumbPreview`}/>
  )
}

export default BreadcrumbDemo
