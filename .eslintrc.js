module.exports = {
  root: true,
  plugins: ['jest'],
  extends: [
    'plugin:jest/recommended',
    '@webpack-contrib/eslint-config-webpack',
    'prettier',
  ],
  env: {
    'jest/globals': true,
  },
};
