const { getDefaultConfig } = require('expo/metro-config');
const { withLunarCSS } = require('@lunar-kit/css/metro');
const path = require('path');
const fs = require('fs');

// Find the project and workspace root
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const coreRoot = path.resolve(workspaceRoot, 'packages/core');
const coreSrc = path.join(coreRoot, 'src');
const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Map @/ alias for the core package
const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    let originReal;
    try {
      originReal = fs.realpathSync(context.originModulePath);
    } catch {
      originReal = context.originModulePath;
    }
    if (originReal.includes(coreRoot) || originReal.includes(coreSrc)) {
      const relativePath = moduleName.slice('@/'.length);
      const absolutePath = path.join(coreSrc, relativePath);
      return context.resolveRequest(context, absolutePath, platform);
    }
  }
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withLunarCSS(config);
