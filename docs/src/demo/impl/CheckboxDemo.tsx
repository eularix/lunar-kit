'use client'

import Demonstration from '@/components/demontration'
import { Checkbox, CheckboxLabel } from '@/lunar-kit/components'
import { View } from 'react-native'
import React from 'react'

const CheckboxDemo = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Demonstration components={
      <View className="gap-4">
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
        </Checkbox>
        <Checkbox checked={true}>
          <CheckboxLabel>Checked checkbox</CheckboxLabel>
        </Checkbox>
        <Checkbox disabled>
          <CheckboxLabel>Disabled checkbox</CheckboxLabel>
        </Checkbox>
      </View>
    } code={`import { Checkbox, CheckboxLabel } from '@/components/ui/checkbox'
import React from 'react'

const CheckboxPreview = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox checked={checked} onCheckedChange={setChecked}>
      <CheckboxLabel>I agree to the terms</CheckboxLabel>
    </Checkbox>
  )
}

export default CheckboxPreview`}/>
  )
}

export default CheckboxDemo
