import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { renderLogo } from '../assets/logo';

export async function initProject() {
  renderLogo();
  console.log(chalk.bold('🌙 Initializing Lunar Kit...\n'));

  const response = await prompts([
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      initial: true,
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you use?',
      choices: [
        { title: 'pnpm', value: 'pnpm' },
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
      ],
      initial: 0,
    },
  ]);

  const spinner = ora('Setting up project structure...').start();

  try {
    // 1. Create components/ui directory
    const componentsDir = path.join(process.cwd(), 'src', 'components', 'ui');
    await fs.ensureDir(componentsDir);
    spinner.text = 'Created components/ui directory';

    // 2. Create lib directory with utils
    const libDir = path.join(process.cwd(), 'lib');
    await fs.ensureDir(libDir);

    const utilsExt = response.typescript ? 'ts' : 'js';
    const utilsPath = path.join(libDir, `utils.${utilsExt}`);
    
    if (!fs.existsSync(utilsPath)) {
      const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
      await fs.writeFile(utilsPath, utilsContent);
      spinner.text = 'Created lib/utils';
    }

    // 3. Create kit.config.json
    const config = {
      $schema: 'https://lunar-kit.dev/schema.json',
      style: 'default',
      rsc: false,
      tsx: response.typescript,
      packageManager: response.packageManager, // DONE: Save package manager
      lunarcss: {
        config: 'lunar.config.ts',
        baseColor: 'slate',
        cssVariables: true,
      },
      aliases: {
        components: '@/src/components',
        utils: '@/src/lib/utils',
      },
    };

    await fs.writeJson(path.join(process.cwd(), 'kit.config.json'), config, {
      spaces: 2,
    });

    spinner.succeed(chalk.green('Project initialized successfully!'));

    console.log('\n' + chalk.bold('Next steps:'));
    console.log(chalk.cyan('1. Install styling engine + helpers:'));
    console.log(chalk.white(`   ${response.packageManager} add @lunar-kit/css clsx tailwind-merge`));
    console.log(chalk.cyan('2. Run @lunar-kit/css setup:'));
    console.log(chalk.white(`   npx lunar-css init`));
    console.log(chalk.cyan('3. Add components:'));
    console.log(chalk.white('   lk add button'));
  } catch (error) {
    spinner.fail('Failed to initialize project');
    console.error(error);
  }
}
