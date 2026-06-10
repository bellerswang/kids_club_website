import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const command = process.argv[2];
const allowedCommands = new Set(['dev', 'build', 'preview', 'check']);

if (!allowedCommands.has(command)) {
  console.error(`Unsupported Astro command: ${command ?? '(missing)'}`);
  process.exit(1);
}

const executableUrl = process.platform === 'win32'
  ? new URL('../node_modules/.bin/astro.cmd', import.meta.url)
  : new URL('../node_modules/.bin/astro', import.meta.url);
const executable = fileURLToPath(executableUrl);

const child = spawn(executable, [command], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1'
  }
});

child.on('exit', (code) => process.exit(code ?? 1));
