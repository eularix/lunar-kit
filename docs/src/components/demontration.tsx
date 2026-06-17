'use client'

import React from 'react'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tabs, TabsList, TabsTrigger } from '@/lunar-kit/components/tabs';
import { ThemeProvider } from '@/lunar-kit/providers/theme-provider';
import { ThemeSwitcher } from './theme-switcher';


export interface DemonstrationProps {
    components: React.ReactNode
    code: string
    /** Hide theme switcher (e.g. for non-themeable demos). */
    hideThemeSwitcher?: boolean
}

const Demonstration: React.FC<DemonstrationProps> = ({ components, code, hideThemeSwitcher }) => {
    const [tab, setTab] = React.useState<string>('Demo')
    // Live RN previews can't be server-rendered (reanimated worklets need the
    // browser). Gate them behind mount so static export / SSR prerender of the
    // docs doesn't crash; the placeholder keeps layout stable (no hydration
    // mismatch — server and first client render both show the placeholder).
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    return (
        <div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className='w-fit'>
                    <Tabs value={tab} onValueChange={setTab} variant={'pill'}>
                        <TabsList className="w-full flex-row">
                            <TabsTrigger value="Demo" className="flex-1 capitalize">Demo</TabsTrigger>
                            <TabsTrigger value="Code" className="flex-1 capitalize">Code</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                {!hideThemeSwitcher && tab === 'Demo' && <ThemeSwitcher />}
            </div>
            <div className='mt-4'>
                {
                    tab === 'Demo' ? (
                        mounted ? (
                            <ThemeProvider>
                                <div className="p-4 min-h-80 flex items-center justify-center border rounded-lg bg-background">
                                    {components}
                                </div>
                            </ThemeProvider>
                        ) : (
                            <div className="p-4 min-h-80 flex items-center justify-center border rounded-lg bg-background" />
                        )
                    ) : (
                        <DynamicCodeBlock lang="tsx" code={code} />
                    )
                }
            </div>
        </div>
    )
}

export default Demonstration
