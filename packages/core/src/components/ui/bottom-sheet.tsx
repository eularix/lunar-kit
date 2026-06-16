import * as React from 'react';
import {
  View,
  Pressable,
  FlatList,
  ScrollView,
  type ListRenderItem,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  clamp,
  type SharedValue,
} from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Checkbox } from './checkbox';
import { Radio } from './radio';
import {
  BottomSheet as PrimitiveBottomSheet,
  BottomSheetContent as PrimitiveContent,
  BottomSheetDragArea,
  BottomSheetTrigger,
  BottomSheetClose,
  useBottomSheetInternal,
  type BottomSheetProps as PrimitiveBottomSheetProps,
} from '@lunar-primitive/bottom-sheet';

// ─── Variants ────────────────────────────────────────────────────────────────

const sheetVariants = cva('rounded-t-3xl shadow-2xl overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-card',
      filled: 'bg-muted',
    },
  },
  defaultVariants: { variant: 'default' },
});

const dragHandleVariants = cva('w-10 h-1 rounded-full mx-auto', {
  variants: {
    variant: {
      default: 'bg-muted-foreground/30',
      filled: 'bg-muted-foreground/50',
    },
  },
  defaultVariants: { variant: 'default' },
});

const listItemVariants = cva(
  'flex-row items-center justify-between px-4 py-3 border-b border-border',
  {
    variants: {
      selected: {
        true: 'bg-accent',
        false: 'bg-transparent',
      },
    },
    defaultVariants: { selected: false },
  }
);

// ─── Variant context ──────────────────────────────────────────────────────────

const VariantCtx = React.createContext<{ variant: 'default' | 'filled' }>({
  variant: 'default',
});

function useVariant() {
  return React.useContext(VariantCtx);
}

// ─── Footer height context ────────────────────────────────────────────────────
// Allows BottomSheetFooter to push paddingBottom into the content area
// automatically so content is never hidden behind the footer.

const FooterHeightCtx = React.createContext<SharedValue<number> | null>(null);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BottomSheetProps
  extends Omit<PrimitiveBottomSheetProps, 'children'>,
  VariantProps<typeof sheetVariants> {
  children: React.ReactNode;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function BottomSheet({
  children,
  variant = 'default',
  snapPoints = ['50%'],
  defaultSnapPoint = 0,
  open,
  onOpenChange,
  style,
}: BottomSheetProps) {
  return (
    <VariantCtx.Provider value={{ variant: variant ?? 'default' }}>
      <PrimitiveBottomSheet
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={snapPoints}
        defaultSnapPoint={defaultSnapPoint}
        style={style}
      >
        {children}
      </PrimitiveBottomSheet>
    </VariantCtx.Provider>
  );
}

export {
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetDragArea,
} from '@lunar-primitive/bottom-sheet';

// ─── Content ──────────────────────────────────────────────────────────────────

export interface BottomSheetContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Styled sheet panel. Only renders inside the modal (RenderMode = 'modal').
 * Applies LunarCSS card styling and auto-renders the drag handle at the top.
 */
export function BottomSheetContent({ children, className }: BottomSheetContentProps) {
  const { variant } = useVariant();
  // Shared value that BottomSheetFooter writes to when it measures itself
  const footerHeight = useSharedValue(0);

  const contentPadStyle = useAnimatedStyle(() => ({
    paddingBottom: footerHeight.value,
  }));

  return (
    <PrimitiveContent style={{ flex: 1 }}>
      <View className={cn(sheetVariants({ variant }), 'flex-1', className)}>
        {/* Default drag handle pill — always visible for discoverability */}
        <BottomSheetDragArea>
          <View className="items-center pt-3 pb-2">
            <View className={cn(dragHandleVariants({ variant }))} />
          </View>
        </BottomSheetDragArea>
        {/* Content area — paddingBottom grows to match footer height */}
        <FooterHeightCtx.Provider value={footerHeight}>
          <Animated.View style={[{ flex: 1 }, contentPadStyle]} className="px-4">
            {children}
          </Animated.View>
        </FooterHeightCtx.Provider>
      </View>
    </PrimitiveContent>
  );
}

/**
 * Default styled drag handle bar.
 * Use <BottomSheetDragArea> directly to wrap a custom draggable header.
 */
export function BottomSheetHandle({ className }: { className?: string }) {
  const { variant } = useVariant();
  return (
    <BottomSheetDragArea>
      <View className={cn('items-center py-3', className)}>
        <View className={cn(dragHandleVariants({ variant }))} />
      </View>
    </BottomSheetDragArea>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function BottomSheetHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={cn('px-4 pb-2', className)}>{children}</View>;
}

// ─── Title ────────────────────────────────────────────────────────────────────

export function BottomSheetTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text variant="header" size="md" className={className}>
      {children}
    </Text>
  );
}

// ─── Description ──────────────────────────────────────────────────────────────

export function BottomSheetDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text variant="muted" size="sm" className={cn('mt-2', className)}>
      {children}
    </Text>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

export function BottomSheetBody({
  children,
  className,
  scrollable,
}: {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}) {
  if (!scrollable) {
    return <View className={cn('flex-1 px-4', className)}>{children}</View>;
  }
  return (
    <ScrollView
      className={cn('flex-1 px-4', className)}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {children}
    </ScrollView>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function BottomSheetFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { dismissTranslateY, lowestSnapHeight, dragAreaHeight } =
    useBottomSheetInternal();

  const footerHeight = useSharedValue(0);
  // Push our height into the content area so it gains matching paddingBottom
  const footerHeightCtx = React.useContext(FooterHeightCtx);

  const footerStyle = useAnimatedStyle(() => {
    const dragH = dragAreaHeight?.value ?? 0;
    const threshold = Math.max(0, lowestSnapHeight - dragH - footerHeight.value);
    const counter = clamp(dismissTranslateY.value, 0, threshold);
    return { transform: [{ translateY: -counter }] };
  });

  return (
    <Animated.View
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        footerHeight.value = h;
        // Automatically add paddingBottom to content so nothing is hidden
        if (footerHeightCtx) footerHeightCtx.value = h;
      }}
      style={[
        { position: 'absolute', bottom: 0, left: 0, right: 0 },
        footerStyle,
      ]}
      className={cn('bg-card px-4 py-4 border-t border-border', className)}
    >
      {children}
    </Animated.View>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

interface BottomSheetListProps<T> {
  data: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  variant?: 'list' | 'select' | 'multiple';
  onSelect?: (selected: T | T[] | null) => void;
  selectedValue?: any;
  selectedValues?: any[];
  getItemValue?: (item: T) => any;
  className?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?:
  | React.ComponentType<any>
  | React.ReactElement
  | null
  | undefined;
}

export function BottomSheetList<T>({
  data,
  renderItem,
  keyExtractor,
  variant = 'list',
  onSelect,
  selectedValue,
  selectedValues = [],
  getItemValue,
  className,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
}: BottomSheetListProps<T>) {
  const [internalSelectedValues, setInternalSelectedValues] =
    React.useState<any[]>(selectedValues);

  const defaultKeyExtractor = (item: T, index: number) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return String((item as any).id);
    }
    return String(index);
  };

  const defaultGetItemValue = (item: T) => {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      return (item as any).value;
    }
    return item;
  };

  const finalKeyExtractor = keyExtractor || defaultKeyExtractor;
  const finalGetItemValue = getItemValue || defaultGetItemValue;

  const handleSelect = (item: T) => {
    const itemValue = finalGetItemValue(item);
    if (variant === 'select') {
      onSelect?.(item);
    } else if (variant === 'multiple') {
      const isSelected = internalSelectedValues.includes(itemValue);
      const next = isSelected
        ? internalSelectedValues.filter((v) => v !== itemValue)
        : [...internalSelectedValues, itemValue];
      setInternalSelectedValues(next);
      onSelect?.(data.filter((d) => next.includes(finalGetItemValue(d))) as T[]);
    } else {
      onSelect?.(item);
    }
  };

  const isItemSelected = (item: T) => {
    const itemValue = finalGetItemValue(item);
    if (variant === 'select') return selectedValue === itemValue;
    if (variant === 'multiple') return internalSelectedValues.includes(itemValue);
    return false;
  };

  const defaultRenderItem: ListRenderItem<T> = ({ item }) => {
    const isSelected = isItemSelected(item);
    const itemLabel =
      typeof item === 'object' && item !== null && 'label' in item
        ? (item as any).label
        : String(item);

    return (
      <Pressable
        onPress={() => handleSelect(item)}
        className={cn(listItemVariants({ selected: isSelected }))}
      >
        <View className="flex-row items-center gap-3 flex-1">
          {variant === 'select' && <Radio checked={isSelected} />}
          {variant === 'multiple' && <Checkbox checked={isSelected} />}
          <Text
            variant="default"
            size="md"
            className={cn('flex-1', isSelected && 'text-primary font-semibold')}
          >
            {itemLabel}
          </Text>
        </View>
        {variant === 'select' && isSelected && (
          <Text className="text-primary font-bold">✓</Text>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem || defaultRenderItem}
      keyExtractor={finalKeyExtractor}
      className={cn('flex-1 px-0', className)}
      showsVerticalScrollIndicator={false}
      bounces={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={ListFooterComponent}
    />
  );
}

// ─── ListItem ─────────────────────────────────────────────────────────────────

export function BottomSheetListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('px-4 py-3 border-b border-border', className)}>
      {children}
    </View>
  );
}
