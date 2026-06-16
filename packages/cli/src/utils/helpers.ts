import fs from 'fs-extra';
import path from 'path';

export async function loadConfig() {
  const configPath = path.join(process.cwd(), 'kit.config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  return await fs.readJson(configPath);
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

export function toPascalCase(str: string): string {
  return str
    .replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// Reject path traversal / absolute paths in user-supplied module identifiers
// before they reach fs writes. Returns the normalized (forward-slash) path.
export function assertSafeRelativePath(p: string): string {
  const normalized = String(p ?? '').replace(/\\/g, '/').trim();
  const segments = normalized.split('/');
  if (
    !normalized ||
    path.isAbsolute(normalized) ||
    segments.some((seg) => seg === '..' || seg === '.' || seg === '')
  ) {
    throw new Error(
      `Invalid path "${p}": must be a relative path without "." or ".." segments.`,
    );
  }
  return normalized;
}

// Assert a target path resolves inside `base`. Use for registry/template file
// paths (which may legitimately start with "/") — defends against "../" escaping
// the destination dir. Returns the resolved absolute path.
export function assertWithin(base: string, target: string): string {
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(target);
  if (resolved !== resolvedBase && !resolved.startsWith(resolvedBase + path.sep)) {
    throw new Error(`Unsafe path "${target}" escapes "${base}".`);
  }
  return resolved;
}
