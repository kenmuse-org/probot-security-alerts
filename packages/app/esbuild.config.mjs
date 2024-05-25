import esbuild from 'esbuild';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import config from '../../esbuild.config.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const settings = { ...config, ...{
  entryPoints: ['./src/app.ts', './src/handler.ts'],
  absWorkingDir: currentDir
}};

await esbuild.build(settings);
