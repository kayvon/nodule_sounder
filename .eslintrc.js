module.exports = {
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jsx-a11y', 'prettier'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],
    'import/extensions': 'warn',
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'no-unused-vars': 'off',
    'prettier/prettier': [
      'warn',
      {
        semi: true,
      },
    ],
    'typescript/ban-ts-ignore': 'off',
  },
};
