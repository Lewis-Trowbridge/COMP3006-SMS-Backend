module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  ignorePatterns: [
    'node_modules/**',
    'dist/**'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  rules: {
    semi: [1, 'never'],
    'sort-keys': 2
  }
}
