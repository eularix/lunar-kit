'use client'

import Demonstration from '@/components/demontration'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubContent,
} from '@/lunar-kit/components/dropdown-menu';
import { Button } from '@/lunar-kit/components/button';
import { View } from 'react-native'
import React from 'react'
import { CreditCard, Star, User, Users } from 'lucide-react-native';

const DropdownMenuDemo = () => {
    return (
        <Demonstration components={
            <View className='w-full flex items-center justify-center min-h-[300px]'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>Open Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onPress={() => { }} leftIcon={<User />}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onPress={() => { }} leftIcon={<CreditCard />}>Billing</DropdownMenuItem>
                            <DropdownMenuItem onPress={() => { }} leftIcon={<Users />}>Team</DropdownMenuItem>
                            <DropdownMenuItem onPress={() => { }} leftIcon={<Star />}>Subscription</DropdownMenuItem>
                            <DropdownMenuSub trigger="More options" leftIcon={<User />}>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onPress={() => console.log('rename')}>
                                        Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onPress={() => console.log('duplicate')}>
                                        Duplicate
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </View>
        } code={`import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem onPress={() => {}}>Profile</DropdownMenuItem>
            <DropdownMenuItem onPress={() => {}}>Billing</DropdownMenuItem>
            <DropdownMenuItem onPress={() => {}}>Team</DropdownMenuItem>
            <DropdownMenuItem onPress={() => {}}>Subscription</DropdownMenuItem>
            <DropdownMenuSub trigger="More options">
                <DropdownMenuSubContent>
                    <DropdownMenuItem onPress={() => console.log('rename')}>
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onPress={() => console.log('duplicate')}>
                        Duplicate
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuGroup>
        </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}`} />
    )
}

export default DropdownMenuDemo
