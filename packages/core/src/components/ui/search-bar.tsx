// components/ui/search-bar.tsx
import * as React from 'react';
import { View, Pressable, Platform, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface SearchBarProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
    onDebouncedValueChange?: (value: string) => void;
    debounceDelay?: number;
    className?: string;
    disabled?: boolean;
}

export function SearchBar({
    value: controlledValue,
    defaultValue = '',
    placeholder = 'Search...',
    onValueChange,
    onDebouncedValueChange,
    debounceDelay = 500,
    className,
    disabled = false,
}: SearchBarProps) {
    const { colors } = useThemeColors();
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = controlledValue ?? internalValue;

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clear any pending debounce on unmount so the callback can't fire late.
    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleChange = (text: string) => {
        if (controlledValue === undefined) {
            setInternalValue(text);
        }
        onValueChange?.(text);

        if (onDebouncedValueChange) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                onDebouncedValueChange(text);
            }, debounceDelay);
        }
    };

    const handleClear = () => {
        handleChange('');
    };

    return (
        <View className={cn("flex-row items-center bg-muted rounded-full px-4 h-12 border border-transparent", disabled && "opacity-50", className)}>
            <Search size={18} color={colors.mutedForeground} />
            <TextInput
                value={currentValue}
                onChangeText={handleChange}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 ml-2 text-foreground text-sm"
                style={{
                    flex: 1,
                    fontSize: 16,
                    color: colors.foreground,
                    padding: 0,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    margin: 0,
                    height: '100%',
                    textAlignVertical: 'center',
                    outlineWidth: 0,
                    ...(Platform.OS === 'ios' && {
                        lineHeight: 20,
                    }),
                    ...(Platform.OS === 'android' && {
                        textAlignVertical: 'center',
                    }),
                }}
                editable={!disabled}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {currentValue.length > 0 && !disabled && (
                <Pressable onPress={handleClear} className="p-1">
                    <X size={16} color={colors.mutedForeground} />
                </Pressable>
            )}
        </View>
    );
}
