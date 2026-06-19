import * as React from 'react';
import { Dimensions, View, type ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { AdaptiveModal } from '@lunar-primitive/adaptive-modal';
import { useBottomSheet } from '../hooks/use-bottom-sheet';

// ─── Render Mode ─────────────────────────────────────────────────────────────
// The children of <BottomSheet> are rendered TWICE:
//   'inline'  → triggers show, content hides   (normal page flow)
//   'modal'   → content shows, triggers hide   (inside the modal)

export type BottomSheetRenderMode = 'inline' | 'modal';

export const BottomSheetRenderModeContext =
  React.createContext<BottomSheetRenderMode>('inline');

export function useBottomSheetRenderMode(): BottomSheetRenderMode {
  return React.useContext(BottomSheetRenderModeContext);
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

export interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints: string[];
  currentSnapPoint: number;
}

export interface BottomSheetInternalContextValue {
  animatedHeight: any;
  backdropOpacity: any;
  dismissTranslateY: any;
  dragAreaHeight: any;
  currentSnapIndex: any;
  panGesture: any;
  sheetAnimatedStyle: any;
  backdropAnimatedStyle: any;
  handleClose: () => void;
  lowestSnapHeight: number;
}

export const BottomSheetContext =
  React.createContext<BottomSheetContextValue | null>(null);

export const BottomSheetInternalContext =
  React.createContext<BottomSheetInternalContextValue | null>(null);

export function useBottomSheetContext() {
  const ctx = React.useContext(BottomSheetContext);
  if (!ctx) throw new Error('BottomSheet components must be used within <BottomSheet>');
  return ctx;
}

export function useBottomSheetInternal() {
  const ctx = React.useContext(BottomSheetInternalContext);
  if (!ctx) throw new Error('BottomSheet internal components must be used within <BottomSheet>');
  return ctx;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  snapPoints?: string[];
  defaultSnapPoint?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomSheet({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  snapPoints = ['50%'],
  defaultSnapPoint = 0,
  children,
  style,
}: BottomSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const {
    animatedHeight,
    backdropOpacity,
    dismissTranslateY,
    dragAreaHeight,
    currentSnapIndex,
    panGesture,
    sheetAnimatedStyle,
    backdropAnimatedStyle,
    visible,
    handleClose,
  } = useBottomSheet({ open, onOpenChange, snapPoints, defaultSnapPoint });

  const snapHeights = React.useMemo(() => {
    const screenHeight = Dimensions.get('window').height;
    return snapPoints.map((p) => (Number.parseInt(p) / 100) * screenHeight);
  }, [snapPoints]);

  const contextValue = React.useMemo(
    () => ({ open, onOpenChange, snapPoints, currentSnapPoint: defaultSnapPoint }),
    [open, onOpenChange, snapPoints, defaultSnapPoint]
  );

  const internalContextValue = React.useMemo(
    () => ({
      animatedHeight,
      backdropOpacity,
      dismissTranslateY,
      dragAreaHeight,
      currentSnapIndex,
      panGesture,
      sheetAnimatedStyle,
      backdropAnimatedStyle,
      handleClose,
      lowestSnapHeight: snapHeights[0],
    }),
    [animatedHeight, backdropOpacity, dismissTranslateY, dragAreaHeight,
      currentSnapIndex, panGesture, sheetAnimatedStyle, backdropAnimatedStyle,
      handleClose, snapHeights]
  );

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <BottomSheetInternalContext.Provider value={internalContextValue}>

        {/* ── Inline render: triggers visible, content hidden ── */}
        <BottomSheetRenderModeContext.Provider value="inline">
          {children}
        </BottomSheetRenderModeContext.Provider>

        {/* ── Modal render: content visible, triggers hidden ── */}
        <AdaptiveModal
          visible={visible}
          onDismiss={handleClose}
          backdropColor="transparent"
          closeOnBackdropPress
          animationType="none"
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Animated backdrop (own opacity for sheet drag-to-fade) */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                backdropAnimatedStyle,
              ]}
              pointerEvents="box-only"
              onTouchEnd={handleClose}
            />

            {/* Sheet panel — slides up from bottom */}
            <Animated.View
              style={[
                { position: 'absolute', bottom: 0, left: 0, right: 0 },
                sheetAnimatedStyle,
                style,
              ]}
            >
              <BottomSheetRenderModeContext.Provider value="modal">
                {children}
              </BottomSheetRenderModeContext.Provider>
            </Animated.View>
          </GestureHandlerRootView>
        </AdaptiveModal>

      </BottomSheetInternalContext.Provider>
    </BottomSheetContext.Provider>
  );
}
