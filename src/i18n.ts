import { createI18n } from 'vue-i18n'

// Import translation messages (you can also import them dynamically)
import pt from './locales/pt.json'
import en from './locales/en.json'

const i18n = createI18n({
  locale: 'pt',
  fallbackLocale: 'en',
  messages: {
    pt,
    en
  }
})

export default i18n
