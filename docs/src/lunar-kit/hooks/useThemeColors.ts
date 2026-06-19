// hooks/useThemeColors.ts (docs mirror)
// @deprecated Use useThemeTokens. Shim during migration.
import { useThemeTokens } from './useThemeTokens';

export function useThemeColors() {
  const { colors, mode } = useThemeTokens();
  return { colors, colorScheme: mode };
}
