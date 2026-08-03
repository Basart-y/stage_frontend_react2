import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/**', '.next/**', 'node_modules/**', 'coverage/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: {...globals.browser, ...globals.node, crypto: 'readonly', clients: 'readonly'},
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-refresh/only-export-components': 'off',
      'no-empty': ['error', {allowEmptyCatch: true}],
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
      'no-undef': ['error', {typeof: true}],
    },
  },
])
