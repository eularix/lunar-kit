import * as React from 'react';
import {
  View as RNView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native';
import { AdaptiveModal } from '@lunar-primitive/adaptive-modal';
import type { Align, PopoverContext as Ctx, Rect, Side } from './types';
import { computePosition } from './positioning';

const PopoverCtx = React.createContext<Ctx | null>(null);

function usePopover(): Ctx {
  const v = React.useContext(PopoverCtx);
  if (!v) throw new Error('Popover.* must be inside <Popover>');
  return v;
}

export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function Popover({ open: openProp, defaultOpen, onOpenChange, children }: PopoverProps) {
  const [openState, setOpenState] = React.useState(!!defaultOpen);
  const open = openProp !== undefined ? openProp : openState;
  const [triggerRect, setTriggerRect] = React.useState<Rect | null>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (openProp === undefined) setOpenState(v);
      onOpenChange?.(v);
    },
    [openProp, onOpenChange]
  );

  const value = React.useMemo<Ctx>(
    () => ({ open, setOpen, triggerRect, setTriggerRect }),
    [open, setOpen, triggerRect]
  );

  return <PopoverCtx.Provider value={value}>{children}</PopoverCtx.Provider>;
}

export type PopoverTriggerProps = {
  asChild?: boolean;
  children: React.ReactNode;
};

export function PopoverTrigger({ asChild, children }: PopoverTriggerProps) {
  const { open, setOpen, setTriggerRect } = usePopover();
  const ref = React.useRef<RNView>(null);

  const measure = (cb?: () => void) => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setTriggerRect({ x, y, width, height });
      cb?.();
    });
  };

  const handlePress = () => measure(() => setOpen(!open));
  const handleLayout = () => measure();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: (node: any) => {
        const childRef = (child as any).ref;
        if (typeof childRef === 'function') childRef(node);
        else if (childRef && typeof childRef === 'object') childRef.current = node;
        (ref as any).current = node;
      },
      onPress: (...args: any[]) => {
        child.props.onPress?.(...args);
        handlePress();
      },
      onLayout: (...args: any[]) => {
        child.props.onLayout?.(...args);
        handleLayout();
      },
    });
  }

  return (
    <Pressable ref={ref as any} onPress={handlePress} onLayout={handleLayout}>
      {children}
    </Pressable>
  );
}

export type PopoverContentProps = ViewProps & {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  collisionPadding?: number;
  avoidCollisions?: boolean;
  closeOnPressOutside?: boolean;
  /** Called whenever resolved side changes due to flip. Useful for arrow rendering. */
  onPlacementChange?: (side: Side, align: Align) => void;
  children: React.ReactNode;
};

export function PopoverContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  collisionPadding = 8,
  avoidCollisions = true,
  closeOnPressOutside = true,
  onPlacementChange,
  style,
  children,
  ...rest
}: PopoverContentProps) {
  const { open, setOpen, triggerRect } = usePopover();
  const { width: vw, height: vh } = useWindowDimensions();
  const [contentSize, setContentSize] = React.useState({ width: 0, height: 0 });

  if (!open || !triggerRect) return null;

  const handleLayout = (e: LayoutChangeEvent) => {
    setContentSize({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const pos = computePosition({
    trigger: triggerRect,
    content: contentSize,
    viewport: { width: vw, height: vh },
    side,
    align,
    sideOffset,
    collisionPadding,
    avoidCollisions,
  });

  React.useEffect(() => {
    onPlacementChange?.(pos.side, pos.align);
  }, [pos.side, pos.align, onPlacementChange]);

  return (
    <AdaptiveModal
      visible={open}
      onDismiss={() => setOpen(false)}
      backdropColor="transparent"
      closeOnBackdropPress={false}
      animationType="none"
      statusBarTranslucent
    >
      <RNView style={{ flex: 1 }} pointerEvents="box-none">
        {closeOnPressOutside && (
          <Pressable
            style={StyleSheet.absoluteFill as any}
            onPress={() => setOpen(false)}
            android_disableSound
          />
        )}
        <RNView
          {...rest}
          onLayout={handleLayout}
          style={[
            { position: 'absolute', top: pos.top, left: pos.left, opacity: contentSize.width === 0 ? 0 : 1 },
            style,
          ]}
        >
          {children}
        </RNView>
      </RNView>
    </AdaptiveModal>
  );
}

/** Imperative open/close hook for callers that need control outside React tree. */
export function usePopoverState() {
  return usePopover();
}
