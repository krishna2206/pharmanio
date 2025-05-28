import { ThemedButton, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ScrollView, View } from "react-native";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const { t, language, isSystemLanguage, setLanguage, setSystemLanguage } = useTranslation();

  const getLanguageDisplayName = () => {
    if (isSystemLanguage) {
      return t('settings.systemLanguage');
    }
    return language === 'en' ? 'English' : 'Français';
  };

  const getLanguageSource = () => {
    return isSystemLanguage ? t('settings.systemLanguage') : t('settings.currentLanguage', { language: getLanguageDisplayName() });
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1 flex-col"
        contentContainerStyle={{ alignItems: "center", paddingHorizontal: 16, paddingVertical: 20, }}
      >
        <ThemedCard className="w-full max-w-sm mb-6">
          <ThemedText className="font-semibold mb-4 text-center">
            {t('settings.themeSettings')}
          </ThemedText>

          <ThemedButton
            variant={colorScheme === 'light' ? 'primary' : 'surface'}
            onPress={() => setColorScheme('light')}
            className="mb-3"
          >
            {t('settings.lightTheme')}
          </ThemedButton>

          <ThemedButton
            variant={colorScheme === 'dark' ? 'primary' : 'surface'}
            onPress={() => setColorScheme('dark')}
            className="mb-3"
          >
            {t('settings.darkTheme')}
          </ThemedButton>

          <ThemedButton
            variant={colorScheme === 'system' ? 'primary' : 'surface'}
            onPress={() => setColorScheme('system')}
            className="mb-4"
          >
            {t('settings.systemDefault')}
          </ThemedButton>

          <ThemedText className="text-on-surface-variant text-center text-sm">
            {t('settings.currentTheme', { theme: colorScheme })}
          </ThemedText>
        </ThemedCard>

        <ThemedCard className="w-full max-w-sm">
          <ThemedText className="font-semibold mb-4 text-center">
            {t('settings.languageSettings')}
          </ThemedText>

          <ThemedButton
            variant={isSystemLanguage ? 'primary' : 'surface'}
            onPress={() => setSystemLanguage()}
            className="mb-3"
          >
            {t('settings.systemLanguage')}
          </ThemedButton>

          <ThemedButton
            variant={!isSystemLanguage && language === 'en' ? 'primary' : 'surface'}
            onPress={() => setLanguage('en')}
            className="mb-3"
          >
            {t('settings.english')}
          </ThemedButton>

          <ThemedButton
            variant={!isSystemLanguage && language === 'fr' ? 'primary' : 'surface'}
            onPress={() => setLanguage('fr')}
            className="mb-4"
          >
            {t('settings.french')}
          </ThemedButton>

          <ThemedText className="text-on-surface-variant text-center text-sm">
            {getLanguageSource()}
            {isSystemLanguage && (
              <ThemedText className="text-on-surface-variant text-center text-xs mt-1">
                ({language === 'en' ? 'English' : 'Français'})
              </ThemedText>
            )}
          </ThemedText>
        </ThemedCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}