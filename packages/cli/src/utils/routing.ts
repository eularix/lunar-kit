import fs from 'fs-extra';
import path from 'path';
import {  toPascalCase, assertSafeRelativePath } from './helpers.js';

export async function addToRouting(config: any, modulePath: string, viewName: string, type: "module" | "view" = 'module') {
  // Reject traversal before any path is written under app/ or src/navigation/.
  modulePath = assertSafeRelativePath(modulePath);
  if (config.navigation === 'expo-router') {
    await addToExpoRouter(config, modulePath, viewName, type);
  } else if (config.navigation === 'react-navigation') {
    await addToReactNavigation(config, modulePath, viewName);
  }
}
async function addToExpoRouter(config: any, modulePath: string, viewName: string, type: "module" | "view" = 'module') {
  const appDir = path.join(process.cwd(), 'app');
  
  const pathParts = modulePath.split('/');
  const routePath = modulePath.replace(/\\/g, '/');
  const routeDir = path.join(appDir, ...routePath.split('/').slice(0, -1));
  const fileName = pathParts[pathParts.length - 1]; // splash-2 atau testing-2-mod
  
  // DONE: Import path pakai FULL modulePath (support nested)
  const importPath = type === 'view'
    ? `@modules/${pathParts.slice(0, -1).join('/')}/view/${viewName.replace('.tsx', '')}`
    : `@modules/${modulePath}/view/${viewName.replace('.tsx', '')}`;
  
  const routeContent = `export { default } from '${importPath}';`;

  // File name di app/ pakai fileName yang terakhir
  const routeFilePath = routePath.includes('/') 
    ? path.join(routeDir, `${fileName}.tsx`)
    : path.join(appDir, `${fileName}.tsx`);

  // Ensure directory exists before writing file
  await fs.ensureDir(path.dirname(routeFilePath));

  await fs.writeFile(routeFilePath, routeContent);
}

async function addToReactNavigation(config: any, modulePath: string, viewName: string) {
  const navDir = path.join(process.cwd(), 'src', 'navigation');
  await fs.ensureDir(navDir);

  const routesFile = path.join(navDir, 'routes.config.ts');
  
  const componentName = toPascalCase(path.basename(modulePath));
  const importStatement = `import ${componentName}View from '@modules/${modulePath}/view/${viewName.replace('.tsx', '')}';`;
  const routeEntry = `  { name: '${componentName}', component: ${componentName}View },`;

  let content = '';
  
  if (fs.existsSync(routesFile)) {
    content = await fs.readFile(routesFile, 'utf-8');
  } else {
    content = `// Auto-generated routes configuration\n\n`;
  }

  // Add import if not exists
  if (!content.includes(importStatement)) {
    const lastImportIndex = content.lastIndexOf('import');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + importStatement + '\n' + content.slice(endOfLine + 1);
    } else {
      content = importStatement + '\n\n' + content;
    }
  }

  // Add route if not exists
  if (!content.includes('export const mainRoutes')) {
    content += `\nexport const mainRoutes = [\n${routeEntry}\n];\n`;
  } else if (!content.includes(routeEntry)) {
    content = content.replace(
      /export const mainRoutes = \[([\s\S]*?)\];/,
      `export const mainRoutes = [$1  ${routeEntry}\n];`
    );
  }

  await fs.writeFile(routesFile, content);
}
