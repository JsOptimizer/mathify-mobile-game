import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
const fallbackLng = 'en';
const lng = deviceLanguage in resources ? deviceLanguage : fallbackLng;

i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
