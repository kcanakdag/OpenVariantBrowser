import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@ovb/core': path.resolve(__dirname, '../../packages/core/src'),
      '@ovb/renderer': path.resolve(__dirname, '../../packages/renderer/src'),
      '@ovb/adapter-gff3': path.resolve(__dirname, '../../packages/adapters/adapter-gff3/src'),
      '@ovb/adapter-vcf-tabix': path.resolve(__dirname, '../../packages/adapters/vcf-tabix/src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from the project root
      allow: ['../..'],
    },
  },
});
