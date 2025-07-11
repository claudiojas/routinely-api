import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'bcryptjs',
    'jsonwebtoken',
    'zod',
    '@prisma/client',
    'fastify',
    '@fastify/cors'
  ],
  noExternal: ['@prisma/client'],
  outDir: 'dist',
  target: 'node18',
  platform: 'node',
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.prisma': 'copy'
    }
  }
}) 