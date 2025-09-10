import i18next from 'i18next'

import de from './locales/de.json'
import en from './locales/en.json'
import da from './locales/da.json'
const i18nOutput = i18next.createInstance()

i18nOutput.init({
  lng: 'en',
  resources: {
    de: { locales: de },
    en: { locales: en },
    da: { locales: da },
  },
  fallbackLng: 'en',
  ns: ['locales'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})
export default i18nOutput
