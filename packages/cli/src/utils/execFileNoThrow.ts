import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface ExecResult {
  stdout: string;
  stderr: string;
  status: number;
  success: boolean;
}

export async function execFileNoThrow(
  command: string,
  args: string[] = [],
  options: Parameters<typeof execFile>[2] = {}
): Promise<ExecResult> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      ...options,
    });
    // execFile may yield Buffer when no string encoding is set — coerce.
    return { stdout: stdout.toString(), stderr: stderr.toString(), status: 0, success: true };
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      status: error.status || 1,
      success: false,
    };
  }
}
