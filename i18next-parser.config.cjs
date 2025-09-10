module.exports = {
  locales: ['de', 'en', 'da'],
  defaultNamespace: 'locales',
  output: 'src/$NAMESPACE/$LOCALE.json',
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  keySeparator: false,
  namespaceSeparator: false,
}
