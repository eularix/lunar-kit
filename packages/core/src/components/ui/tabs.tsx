// components/ui/tabs.tsx
import * as React from 'react';
import { View, Pressable, Animated, LayoutChangeEvent, Platform } from 'react-native';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';

const isWeb = Platform.OS === 'web';


const tabsListVariants = cva('relative flex-row items-center', {
    variants: {
        variant: {
            pill: 'bg-muted rounded-lg p-1',
            underline: 'border-b border-border',
        },
    },
    defaultVariants: { variant: 'underline' },
});

const tabsTriggerVariants = cva('flex-1 items-center justify-center', {
    variants: {
        variant: {
            pill: 'px-3 py-1.5 rounded-md z-10',
            underline: '',
        },
        disabled: {
            true: 'opacity-50',
            false: '',
        },
    },
    defaultVariants: { variant: 'underline', disabled: false },
});

const triggerTextVariants = cva('', {
    variants: {
        active: {
            true: 'text-foreground',
            false: 'text-muted-foreground',
        },
    },
    defaultVariants: { active: false },
});


interface TabLayout { x: number; width: number; height: number }

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
    variant?: 'pill' | 'underline';
}

interface TabsListContextValue extends TabsContextValue {
    registerTab: (tabValue: string, layout: TabLayout) => void;
    tabLayouts: Map<string, TabLayout>;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
const TabsListContext = React.createContext<TabsListContextValue | null>(null);

const useTabsContext = () => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error('Must be used within <Tabs>');
    return ctx;
};

const useTabsListContext = () => {
    const ctx = React.useContext(TabsListContext);
    if (!ctx) throw new Error('Must be used within <TabsList>');
    return ctx;
};


export interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    variant?: 'pill' | 'underline';
    className?: string;
}
export interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}
export interface TabsTriggerProps {
    value: string;
    children: string;
    className?: string;
    disabled?: boolean;
}
export interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}


function PillIndicator({ layout }: { layout: TabLayout }) {
    if (isWeb) {
        return (
            <View
                className="absolute bg-background rounded-md"
                style={{
                    left: layout.x,
                    width: layout.width,
                    height: layout.height,
                    // @ts-ignore
                    transition: 'left 0.2s ease, width 0.2s ease, height 0.2s ease',
                }}
            />
        );
    }

    return <NativePillIndicator layout={layout} />;
}

function NativePillIndicator({ layout }: { layout: TabLayout }) {
    const x = React.useRef(new Animated.Value(layout.x)).current;
    const width = React.useRef(new Animated.Value(layout.width)).current;
    const height = React.useRef(new Animated.Value(layout.height)).current;
    const isFirst = React.useRef(true);

    React.useEffect(() => {
        if (isFirst.current) {
            x.setValue(layout.x);
            width.setValue(layout.width);
            height.setValue(layout.height);
            isFirst.current = false;
            return;
        }
        Animated.parallel([
            Animated.timing(x, { toValue: layout.x, duration: 200, useNativeDriver: false }),
            Animated.timing(width, { toValue: layout.width, duration: 200, useNativeDriver: false }),
            Animated.timing(height, { toValue: layout.height, duration: 200, useNativeDriver: false }),
        ]).start();
    }, [layout.x, layout.width, layout.height]);

    return (
        <Animated.View
            className="absolute bg-background rounded-md"
            style={{ left: x, width, height }}
        />
    );
}


function UnderlineIndicator({ isActive }: { isActive: boolean }) {
    if (isWeb) {
        return (
            <View
                className="h-0.5 w-full mt-2 rounded-full bg-primary"
                style={{
                    opacity: isActive ? 1 : 0,
                    // @ts-ignore
                    transition: 'opacity 0.2s ease',
                }}
            />
        );
    }

    return <NativeUnderlineIndicator isActive={isActive} />;
}

function NativeUnderlineIndicator({ isActive }: { isActive: boolean }) {
    const opacity = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: isActive ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isActive]);

    return (
        <Animated.View
            className="h-0.5 w-full mt-2 rounded-full bg-primary"
            style={{ opacity }}
        />
    );
}


export function Tabs({ value, onValueChange, children, variant = 'underline', className }: TabsProps) {
    return (
        <TabsContext.Provider value={{ value, onValueChange, variant }}>
            <View className={cn('flex', className)}>{children}</View>
        </TabsContext.Provider>
    );
}


export function TabsList({ children, className }: TabsListProps) {
    const { value, onValueChange, variant } = useTabsContext();
    const [tabLayouts, setTabLayouts] = React.useState<Map<string, TabLayout>>(new Map());

    const registerTab = React.useCallback((tabValue: string, layout: TabLayout) => {
        setTabLayouts((prev) => {
            const next = new Map(prev);
            next.set(tabValue, layout);
            return next;
        });
    }, []);

    const activeLayout = tabLayouts.get(value);

    return (
        <TabsListContext.Provider value={{ value, onValueChange, variant, registerTab, tabLayouts }}>
            <View className={cn(tabsListVariants({ variant }), className)}>
                {variant === 'pill' && activeLayout && (
                    <PillIndicator layout={activeLayout} />
                )}
                {children}
            </View>
        </TabsListContext.Provider>
    );
}


export function TabsTrigger({ value: triggerValue, children, className, disabled = false }: TabsTriggerProps) {
    const { value, onValueChange, variant, registerTab } = useTabsListContext();
    const isActive = value === triggerValue;

    const handleLayout = (e: LayoutChangeEvent) => {
        const { x, width, height } = e.nativeEvent.layout;
        registerTab(triggerValue, { x, width, height });
    };

    return (
        <Pressable
            onPress={() => !disabled && onValueChange(triggerValue)}
            onLayout={handleLayout}
            disabled={disabled}
            className={cn(tabsTriggerVariants({ variant, disabled }), className)}
            style={isWeb ? { cursor: disabled ? 'not-allowed' : 'pointer' } as any : undefined}
        >
            <View className="items-center w-full">
                <Text
                    size={variant === 'pill' ? 'sm' : 'md'}
                    variant="label"
                    className={cn(triggerTextVariants({ active: isActive }))}
                >
                    {children}
                </Text>

                {variant === 'underline' && (
                    <UnderlineIndicator isActive={isActive} />
                )}
            </View>
        </Pressable>
    );
}


export function TabsContent({ value: contentValue, children, className }: TabsContentProps) {
    const { value } = useTabsContext();
    if (value !== contentValue) return null;
    return <View className={cn('pt-4', className)}>{children}</View>;
}
