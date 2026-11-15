import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'

export default defineConfig(
  { ignores: ['dist/', 'src-tauri/', 'docs/dev/sketches/'] },

  // The recommended rules: JavaScript, TypeScript, Svelte
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,

  // Style is Prettier's: these turn off every rule that would argue with it
  prettier,
  svelte.configs.prettier,

  // The interface runs in the webview; the config files run in Node
  {
    files: ['src/**'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.js', '*.ts'],
    languageOptions: { globals: globals.node },
  },

  // A Svelte file's script is TypeScript
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: { parser: ts.parser, extraFileExtensions: ['.svelte'], svelteConfig },
    },
  },
)
