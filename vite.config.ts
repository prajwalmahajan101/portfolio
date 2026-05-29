import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import yaml from '@rollup/plugin-yaml';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    yaml(),
    glsl({
      include: ['**/*.glsl', '**/*.wgsl', '**/*.vert', '**/*.frag', '**/*.vs', '**/*.fs'],
      warnDuplicatedImports: false,
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 5173, host: true },
  build: { target: 'esnext', sourcemap: true },
});
