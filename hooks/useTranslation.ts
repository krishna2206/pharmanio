import { useI18nStore } from '@/stores/useI18nStore';

export function useTranslation() {
  const { language, isSystemLanguage, setLanguage, setSystemLanguage, t } = useI18nStore();
  
  return {
    language,
    isSystemLanguage,
    setLanguage,
    setSystemLanguage,
    t,
  };
}