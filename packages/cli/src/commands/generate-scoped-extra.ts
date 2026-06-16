import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, toSnakeCase, toPascalCase } from '../utils/helpers.js';
import { updateBarrelExport } from '../utils/barrel.js';
import {
  generateModuleApiTemplate,
  generateModuleTypeTemplate,
} from '@lunar-kit/core/templates';

// Auto-create lib/api if it doesn't exist
async function ensureApiExists() {
  const config = await loadConfig();
  if (!config) return;

  const srcDir = config.srcDir || 'src';
  const libDir = path.join(process.cwd(), srcDir, 'lib');
  const apiPath = path.join(libDir, 'api.ts');

  // Check if api.ts already exists
  if (await fs.pathExists(apiPath)) {
    return;
  }

  // Check if axios is installed
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  const hasAxios = packageJson.dependencies?.axios;

  // Create lib/api.ts
  await fs.ensureDir(libDir);

  const apiContent = `/**
 * API Client
 *
 * Pre-configured axios instance with interceptors for:
 * - Base URL from env config
 * - Auth token injection
 * - Error handling
 * - Request/response logging in dev
 *
 * Usage:
 * \`\`\`ts
 * import { api } from '@/lib/api';
 *
 * const users = await api.get('/users');
 * const user = await api.post('/users', { name: 'John' });
 * \`\`\`
 */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — inject auth token
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * Response interceptor — handle common errors
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      // TODO: Navigate to login or trigger auth refresh
    }
    return Promise.reject(error);
  },
);

/**
 * Auth helpers
 */
export async function setAuthToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}
`;

  await fs.writeFile(apiPath, apiContent);

  // Create barrel export
  const barrelPath = path.join(libDir, 'index.ts');
  await fs.writeFile(barrelPath, `export { api, setAuthToken, clearAuthToken, getAuthToken } from './api';\n`);

  console.log(chalk.dim('  Auto-created: ') + chalk.cyan(`${srcDir}/lib/api.ts`));

  // Prompt to install axios if not present
  if (!hasAxios) {
    console.log(chalk.yellow('\n⚠ Missing dependency: axios'));
    const { default: prompts } = await import('prompts');
    const response = await prompts([
      {
        type: 'confirm',
        name: 'install',
        message: 'Do you want to install axios now?',
        initial: true,
      },
    ]);

    const packageManager = config.packageManager || 'pnpm';
    if (response.install) {
      const { execa } = await import('execa');
      
      const installSpinner = ora('Installing axios...').start();
      try {
        await execa(packageManager, ['add', 'axios'], {
          cwd: process.cwd(),
          stdio: 'ignore',
        });
        installSpinner.succeed(chalk.green('axios installed'));
      } catch (error) {
        installSpinner.fail('Failed to install axios');
        console.log(chalk.dim(`  Run: ${packageManager} add axios`));
      }
    } else {
      console.log(chalk.dim(`  Run: ${packageManager} add axios`));
    }
  }
}

// Generate module-scoped API layer
export async function generateModuleApi(fullPath: string) {
  const spinner = ora('Generating module API layer...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // Ensure lib/api exists
    await ensureApiExists();

    // Parse path: auth/login → modulePath: auth, apiName: login
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/api-name (e.g., auth/auth-api)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/');
    const apiName = parts[parts.length - 1];

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);

    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const apiDir = path.join(moduleFullPath, 'api');
    await fs.ensureDir(apiDir);

    const fileName = `${toSnakeCase(apiName)}.ts`;

    const apiContent = generateModuleApiTemplate({
      apiName,
      moduleName: modulePath,
    });

    const filePath = path.join(apiDir, fileName);
    await fs.writeFile(filePath, apiContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(moduleFullPath, 'index.ts'),
      `export { ${toPascalCase(`${apiName}Api`)} } from './api/${toSnakeCase(apiName)}';`
    );

    spinner.succeed(chalk.green(`API layer ${apiName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/api/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate API layer');
    console.error(error);
  }
}

// Generate module-scoped TypeScript types/interfaces
export async function generateModuleType(fullPath: string) {
  const spinner = ora('Generating module types...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // Parse path: auth/user → modulePath: auth, typeName: user
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/type-name (e.g., auth/user)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/');
    const typeName = parts[parts.length - 1];

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);

    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const typesDir = path.join(moduleFullPath, 'types');
    await fs.ensureDir(typesDir);

    const fileName = `${toSnakeCase(typeName)}.ts`;

    const typeContent = generateModuleTypeTemplate({
      typeName,
      moduleName: modulePath,
    });

    const filePath = path.join(typesDir, fileName);
    await fs.writeFile(filePath, typeContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(moduleFullPath, 'index.ts'),
      `export type * from './types/${toSnakeCase(typeName)}';`
    );

    spinner.succeed(chalk.green(`Types ${typeName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/types/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate types');
    console.error(error);
  }
}
