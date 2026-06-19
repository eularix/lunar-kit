import * as React from 'react';
import { Modal, Platform } from 'react-native';
import { Portal } from './portal';

export interface AdaptiveModalProps {
  /** Controls modal visibility. */
  visible: boolean;
  /** Called on backdrop press, ESC key, or hardware back button. */
  onDismiss?: () => void;
  /** Modal content. Caller owns layout. */
  children: React.ReactNode;
  /**
   * Backdrop overlay color (web + visual cue).
   * Native callers must render their own backdrop inside `children`.
   * @default 'rgba(0,0,0,0.5)'
   */
  backdropColor?: string;
  /**
   * Whether backdrop click / ESC closes the modal.
   * @default true
   */
  closeOnBackdropPress?: boolean;
  /**
   * Native Modal animation. Web ignores (callers animate `children`).
   * @default 'none'
   */
  animationType?: 'none' | 'fade' | 'slide';
  /**
   * Render under the status bar on Android. Native-only.
   * @default true
   */
  statusBarTranslucent?: boolean;
  /** ARIA label for the dialog (web). */
  'aria-label'?: string;
  /** ARIA labelledby id (web). */
  'aria-labelledby'?: string;
}

// ─── Web body scroll lock ────────────────────────────────────────────────────
let lockCount = 0;
let prevOverflow: string | null = null;

function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = prevOverflow ?? '';
    prevOverflow = null;
  }
}

// ─── Focus trap (web) ────────────────────────────────────────────────────────
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

export function AdaptiveModal({
  visible,
  onDismiss,
  children,
  backdropColor = 'rgba(0,0,0,0.5)',
  closeOnBackdropPress = true,
  animationType = 'none',
  statusBarTranslucent = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: AdaptiveModalProps) {
  // ── Web ──────────────────────────────────────────────────────────────────
  const isWeb = Platform.OS === 'web';
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isWeb || !visible) return;

    // Save focus for restore
    if (typeof document !== 'undefined') {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
    }

    lockBodyScroll();

    // Initial focus
    const focusFirst = () => {
      const els = getFocusable(dialogRef.current);
      (els[0] ?? dialogRef.current)?.focus();
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnBackdropPress) {
        e.stopPropagation();
        onDismiss?.();
        return;
      }
      if (e.key === 'Tab') {
        const els = getFocusable(dialogRef.current);
        if (els.length === 0) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      unlockBodyScroll();
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [isWeb, visible, closeOnBackdropPress, onDismiss]);

  if (!visible) return null;

  if (isWeb) {
    return (
      <Portal>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          ref={dialogRef}
          tabIndex={-1}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: backdropColor,
            outline: 'none',
          }}
        >
          {closeOnBackdropPress && (
            <div
              onClick={onDismiss}
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      </Portal>
    );
  }

  // ── Native ───────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={() => {
        if (closeOnBackdropPress) onDismiss?.();
      }}
    >
      {children}
    </Modal>
  );
}

AdaptiveModal.displayName = 'AdaptiveModal';
