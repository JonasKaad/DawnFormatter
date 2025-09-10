import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { LANGUAGE } from './data/StorageKeys'
import de from './locales/de.json'
import da from './locales/da.json'
import en from './locales/en.json'

const savedLanguage = localStorage.getItem(LANGUAGE) || 'en'

i18n.use(initReactI18next).init({
  resources: {
    de: { locales: de },
    da: { locales: da },
    en: { locales: en },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  ns: ['locales'],
  defaultNS: 'locales',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
