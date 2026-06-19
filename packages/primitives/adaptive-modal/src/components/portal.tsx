import * as React from 'react';
import { Platform } from 'react-native';
import * as ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  /** Optional container; defaults to document.body. */
  container?: HTMLElement | null;
}

/**
 * Portal — renders children outside the normal tree.
 *  Web    → React DOM `createPortal`, mounted after first effect (SSR-safe).
 *  Native → renders children inline (Modal handles elevation).
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (Platform.OS !== 'web') return <>{children}</>;
  if (!mounted || typeof document === 'undefined') return null;

  const target = container ?? document.body;
  return ReactDOM.createPortal(<>{children}</>, target);
}
