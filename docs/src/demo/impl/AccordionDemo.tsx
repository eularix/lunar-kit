'use client'

import Demonstration from '@/components/demontration'
import { Accordion, AccordionContent, AccordionContentText, AccordionItem, AccordionTrigger, AccordionTriggerText } from '@/lunar-kit/components/accordion'
import { View } from 'react-native'
import React from 'react'

const AccordionDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
       <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <AccordionTriggerText>What is React Native?</AccordionTriggerText>
            </AccordionTrigger>
            <AccordionContent>
              <AccordionContentText>
                React Native is an open-source mobile application framework created by Facebook.
                It allows developers to use React along with native platform capabilities.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <AccordionTriggerText>How does it work?</AccordionTriggerText>
            </AccordionTrigger>
            <AccordionContent>
              <AccordionContentText>
                React Native uses native components instead of web components.
                This provides better performance and a more native user experience.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <AccordionTriggerText>Is it free to use?</AccordionTriggerText>
            </AccordionTrigger>
            <AccordionContent>
              <AccordionContentText>
                Yes, React Native is completely free and open source.
                It&apos;s licensed under the MIT License.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <AccordionTriggerText>Is it free to use?</AccordionTriggerText>
            </AccordionTrigger>
            <AccordionContent>
              <AccordionContentText>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum explicabo reiciendis quaerat voluptates voluptas quae dolore, iusto culpa qui perspiciatis vitae ab suscipit aliquid nihil a! Recusandae ipsum aspernatur repellendus facilis. Necessitatibus quisquam excepturi eius exercitationem sequi tempore et dignissimos temporibus a facilis, maxime quibusdam nihil tenetur ut aspernatur id sapiente impedit? Iure labore facilis aut, nostrum nemo qui velit cumque, totam fugiat harum ipsa itaque ab explicabo numquam recusandae consequatur molestiae officiis excepturi mollitia perspiciatis aliquid voluptas expedita reiciendis. Blanditiis, aspernatur similique optio porro labore tenetur obcaecati neque natus cum eos dignissimos molestiae facilis debitis illo facere fugiat, aliquid ab soluta. Illum consequuntur natus exercitationem. Modi, corporis. Ipsum sapiente nostrum exercitationem. Blanditiis hic, nisi odit nostrum eius nulla impedit praesentium soluta alias laboriosam suscipit iusto, animi pariatur esse! Illo commodi ad possimus excepturi voluptatem, ut voluptatibus eveniet, perferendis architecto obcaecati repellat magni labore. Rerum neque nobis laborum, cum expedita inventore nesciunt reiciendis, deserunt libero sunt, impedit ut ad molestias assumenda necessitatibus vitae! Harum vitae asperiores doloremque saepe quam quasi aperiam aut totam consequatur eveniet soluta, impedit dicta sequi mollitia maiores aspernatur molestias sunt, atque error hic incidunt in deleniti? Dicta fugiat asperiores provident odio perspiciatis delectus, nostrum voluptatum repudiandae?
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    } code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionTriggerText, AccordionContent, AccordionContentText } from '@/components/ui/accordion'

const AccordionPreview = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <AccordionTriggerText>Question</AccordionTriggerText>
        </AccordionTrigger>
        <AccordionContent>
          <AccordionContentText>Answer here</AccordionContentText>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default AccordionPreview`}/>
  )
}

export default AccordionDemo
