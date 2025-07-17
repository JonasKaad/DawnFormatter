import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import de from './locales/de.json'
import en from './locales/en.json'

i18n.use(initReactI18next).init({
  resources: {
    de: { locales: de },
    en: { locales: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['locales'],
  defaultNS: 'locales',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
