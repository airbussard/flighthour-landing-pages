module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
}