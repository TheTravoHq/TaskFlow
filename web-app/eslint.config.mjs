import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default eslintConfig;
