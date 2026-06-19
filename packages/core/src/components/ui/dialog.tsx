// components/ui/dialog.tsx
import * as React from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { AdaptiveModal } from '@lunar-primitive/adaptive-modal';

// ─── CVA variants ─────────────────────────────────────────────────────────────

const dialogContentVariants = cva(
  'bg-background rounded-2xl border border-border shadow-2xl overflow-hidden',
  {
    variants: {
      size: {
        sm: 'web:max-w-sm',
        md: 'web:max-w-md',
        lg: 'web:max-w-lg',
        full: 'web:max-w-full',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const dialogHeaderVariants = cva('mb-4', {
  variants: {
    align: {
      start: 'items-start',
      center: 'items-center',
    },
  },
  defaultVariants: { align: 'start' },
});

const dialogFooterVariants = cva('flex-row gap-2 mt-6', {
  variants: {
    justify: {
      end: 'justify-end',
      start: 'justify-start',
      center: 'justify-center',
      between: 'justify-between',
    },
  },
  defaultVariants: { justify: 'end' },
});

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends VariantProps<typeof dialogContentVariants> {
  children: React.ReactNode;
  className?: string;
  /** Whether tapping the backdrop closes the dialog. @default true */
  closeOnBackdropPress?: boolean;
}

interface DialogHeaderProps extends VariantProps<typeof dialogHeaderVariants> {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps extends VariantProps<typeof dialogFooterVariants> {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog');
  }
  return context;
}

// ─── Dialog Root ──────────────────────────────────────────────────────────────

export function Dialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

// ─── Dialog Trigger ───────────────────────────────────────────────────────────

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useDialog();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(true),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(true)}>
      {children}
    </Pressable>
  );
}

// ─── Dialog Content ───────────────────────────────────────────────────────────

export function DialogContent({ children, className, size, closeOnBackdropPress = true }: DialogContentProps) {
  const { open, onOpenChange } = useDialog();

  const [visible, setVisible] = React.useState(false);

  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [open]);

  return (
    <AdaptiveModal
      visible={visible}
      onDismiss={() => onOpenChange(false)}
      closeOnBackdropPress={closeOnBackdropPress}
      backdropColor="transparent"
      animationType="none"
    >
      {/* Full-screen root with backdrop */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {/* Backdrop dismissal layer */}
        <Pressable
          onPress={() => onOpenChange(false)}
          style={StyleSheet.absoluteFill as any}
        />
        {/* Centering wrapper with screen margin */}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={cn('w-full', dialogContentVariants({ size }), className)}
          >
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
              className="p-6"
            >
              {children}
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </AdaptiveModal>
  );
}

// ─── Dialog Header ────────────────────────────────────────────────────────────

export function DialogHeader({ children, className, align }: DialogHeaderProps) {
  return (
    <View className={cn(dialogHeaderVariants({ align }), className)}>
      {children}
    </View>
  );
}

// ─── Dialog Title ─────────────────────────────────────────────────────────────

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <Text size="xl" variant="title" className={cn(className)}>
      {children}
    </Text>
  );
}

// ─── Dialog Description ───────────────────────────────────────────────────────

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <Text className={cn('text-muted-foreground mt-2', className)}>
      {children}
    </Text>
  );
}

// ─── Dialog Footer ────────────────────────────────────────────────────────────

export function DialogFooter({ children, className, justify }: DialogFooterProps) {
  return (
    <View className={cn(dialogFooterVariants({ justify }), className)}>
      {children}
    </View>
  );
}

// ─── Dialog Close ─────────────────────────────────────────────────────────────

export function DialogClose({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useDialog();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(false),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(false)}>
      {children}
    </Pressable>
  );
}