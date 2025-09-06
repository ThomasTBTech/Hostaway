import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier/recommended';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import expo from 'eslint-config-expo/flat.js';

export default defineConfig([
 {
  ignores: [
   '**/node_modules/**',
   '**/dist/**',
   '**/.expo/**',
   '**/build/**',
   '**/.prettierrc.js',
   '**/android/**',
   '**/ios/**',
  ],
 },
 expo,
 prettier,
 {
  files: ['**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
   parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: process.cwd(),
    ecmaVersion: 2020,
    sourceType: 'module',
   },
  },
  plugins: {
   'unused-imports': unusedImportsPlugin,
  },
  rules: {
   'prefer-const': 'warn',
   'no-constant-binary-expression': 'error',
   'unused-imports/no-unused-imports': 'error',
  },
 },
]);
