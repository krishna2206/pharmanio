import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import mg from '@/locales/mg.json';

export type SupportedLanguage = 'en' | 'fr' | 'mg';

interface Translations {
  [key: string]: any;
}

const translations: Record<SupportedLanguage, Translations> = {
  en,
  fr,
  mg,
};

function detectSystemLanguage(): SupportedLanguage {
  const deviceLocales = Localization.getLocales();
  const primaryLocale = deviceLocales[0];
  
  if (!primaryLocale) {
    return 'fr';
  }
  
  const languageCode = primaryLocale.languageCode?.toLowerCase();
  
  switch (languageCode) {
    case 'fr':
      return 'fr';
    case 'mg':
      return 'mg';
    default:
      return 'fr';
  }
}

interface I18nState {
  language: SupportedLanguage;
  isSystemLanguage: boolean;
  setLanguage: (language: SupportedLanguage) => void;
  setSystemLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LANGUAGE_STORAGE_KEY = '@language_preference';

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: detectSystemLanguage(),
      isSystemLanguage: true,
      
      setLanguage: (language: SupportedLanguage) => {
        set({ language, isSystemLanguage: false });
      },
      
      setSystemLanguage: () => {
        const systemLang = detectSystemLanguage();
        set({ language: systemLang, isSystemLanguage: true });
      },
      
      t: (key: string, params?: Record<string, string | number>) => {
        const { language } = get();
        const keys = key.split('.');
        let value: any = translations[language];
        
        // Navigate through nested keys
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            // Fallback to French if translation not found
            value = translations.fr;
            for (const k of keys) {
              if (value && typeof value === 'object' && k in value) {
                value = value[k];
              } else {
                return key; // Return key if no translation found
              }
            }
            break;
          }
        }
        
        if (typeof value !== 'string') {
          return key;
        }
        
        // Replace parameters in the string
        if (params) {
          return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
            return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
          }, value);
        }
        
        return value;
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // Custom state persistence to handle system language detection
      onRehydrateStorage: () => (state) => {
        // If user hasn't explicitly set a language preference, use system language
        if (state?.isSystemLanguage) {
          const systemLang = detectSystemLanguage();
          if (state.language !== systemLang) {
            state.language = systemLang;
          }
        }
      },
    }
  )
);