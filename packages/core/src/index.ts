/// <reference types="@lunar-kit/css/types" />
// React Native compatible - lazy path resolution
// Path constants only resolve when accessed (in Node.js context)
// The reference above augments RN components with `className` (replaces the
// deleted nativewind-env.d.ts) so core's source + dts build typecheck.

export const REGISTRY_URL = 'https://raw.githubusercontent.com/dimsmaul/lunar-kit/main/packages/core/src/registry';

// Lazy path resolution - only works in Node.js (CLI tools)
// In React Native, these will return empty strings but won't crash
const getPath = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    
    // Try to get __dirname from CommonJS context
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getDirname = new Function('return __dirname') as () => string;
    const __dirname = getDirname();
    
    if (__dirname) {
      return { path, __dirname };
    }
  } catch {
    // React Native or browser - return fallback
  }
  return { path: null, __dirname: '' };
};

let _paths: { path: any; __dirname: string } | null = null;
const getPaths = () => {
  if (!_paths) {
    _paths = getPath();
  }
  return _paths;
};

// Lazy-evaluated path functions
const getLocalRegistryPath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src', 'registry') : '';
};

const getLocalComponentsPath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src', 'components') : '';
};

const getLocalSourcePath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src') : '';
};

const getLocalTemplatesPath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src', 'templates') : '';
};

// Path constants - lazily evaluated
export const LOCAL_REGISTRY_PATH = getLocalRegistryPath();
export const LOCAL_COMPONENTS_PATH = getLocalComponentsPath();
export const LOCAL_SOURCE_PATH = getLocalSourcePath();
export const LOCAL_TEMPLATES_PATH = getLocalTemplatesPath();

// Export components
export * from './components/ui';
export * from './hooks/index';
export * from './providers/theme-provider';
export { toast } from './stores/toast';

// Export templates (for CLI)
export * from './templates';