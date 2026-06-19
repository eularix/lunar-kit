// hooks/useThemeColors.ts
// @deprecated Use `useThemeTokens()` instead. Kept as a shim during migration.
import { useThemeTokens } from './useThemeTokens';

export function useThemeColors() {
  const { colors, mode } = useThemeTokens();
  return { colors, colorScheme: mode };
}
