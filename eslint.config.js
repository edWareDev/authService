import pluginVitest from 'eslint-plugin-vitest';
import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Habilita variables globales como `window`, `document`
        ...globals.node     // Habilita variables globales como `require`, `process`
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],// Permite variables sin usar si comienzan con "_"
      'eqeqeq': ['error', 'always'],// Obliga a usar === en vez de ==
      'no-undef': 'error',// Marca como error usar variables no definidas
      'no-empty': ['warn', { allowEmptyCatch: true }],// Permite catch {} vacío, pero da warning si otros bloques están vacíos
      'prefer-const': 'warn', // Sugiere usar const si no se reasigna la variable
      'no-var': 'error',// Prohíbe completamente el uso de `var`
      'semi': ['error', 'always'],// Requiere punto y coma al final de las líneas
      'no-shadow': 'warn',// Da advertencia si sombreas variables del scope padre
      'no-magic-numbers': ['warn', { ignoreArrayIndexes: true }] //Evita usar números mágicos en el código, para que sean declarados como constantes.
    },
    plugins: {
      vitest: pluginVitest // Habilita el plugin de pruebas para Vitest
    }
  },

  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...pluginVitest.environments.env.globals, // Habilita globals como `describe`, `it`, `expect`
      },
    },
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      'vitest/no-focused-tests': 'error',  // Prohíbe pruebas marcadas como `.only`
      'vitest/no-disabled-tests': 'warn',      // Advierte si hay pruebas `.skip`
      'vitest/expect-expect': 'warn',      // Advierte si falta un `expect()` en los tests
      'vitest/prefer-to-have-length': 'warn',      // Prefiere usar `.toHaveLength()` en lugar de `.length` manual
      'vitest/prefer-lowercase-title': 'warn',      // Advierte si el título de un test no está en minúsculas
    },
  }
];
