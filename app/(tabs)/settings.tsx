import { EnglishFlag, FrenchFlag, MalagasyFlag, SectionHeader, ThemedButton, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const colors = useThemeColors();

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/krishna2206/pharmanio');
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1 flex-col"
        contentContainerStyle={{ alignItems: "center", paddingHorizontal: 16, paddingVertical: 20, }}
      >
        <SectionHeader title={t('settings.themeSettings')} />
        <ThemedCard className="w-full max-w-md mb-6 border-border/50">
          <View className="flex-row gap-3">
            {/* Light Theme Option */}
            <TouchableOpacity
              onPress={() => setColorScheme('light')}
              className={`flex-1 h-24 rounded-2xl items-center justify-center border ${colorScheme === 'light'
                ? 'bg-primary border-primary'
                : 'bg-surface border-border/50'
                }`}
            >
              <Ionicons
                name="sunny"
                size={28}
                color={colorScheme === 'light' ? '#ffffff' : '#fbbf24'}
              />
              <ThemedText className={`text-xs mt-1 ${colorScheme === 'light' ? 'text-white' : 'text-on-surface-variant'
                }`}>
                {t('settings.light')}
              </ThemedText>
            </TouchableOpacity>

            {/* Dark Theme Option */}
            <TouchableOpacity
              onPress={() => setColorScheme('dark')}
              className={`flex-1 h-24 rounded-2xl items-center justify-center border ${colorScheme === 'dark'
                ? 'bg-primary border-primary'
                : 'bg-surface border-border/50'
                }`}
            >
              <Ionicons
                name="moon"
                size={28}
                color={colorScheme === 'dark' ? '#ffffff' : '#6366f1'}
              />
              <ThemedText className={`text-xs mt-1 ${colorScheme === 'dark' ? 'text-white' : 'text-on-surface-variant'
                }`}>
                {t('settings.dark')}
              </ThemedText>
            </TouchableOpacity>

            {/* System Theme Option */}
            <TouchableOpacity
              onPress={() => setColorScheme('system')}
              className={`flex-1 h-24 rounded-2xl items-center justify-center border ${colorScheme === 'system'
                ? 'bg-primary border-primary'
                : 'bg-surface border-border/50'
                }`}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={28}
                color={colorScheme === 'system' ? '#ffffff' : colors.onSurfaceVariant}
              />
              <ThemedText className={`text-xs mt-1 text-center ${colorScheme === 'system' ? 'text-white' : 'text-on-surface-variant'
                }`}>
                {t('settings.system')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedCard>

        <SectionHeader title={t('settings.languageSettings')} />
        <ThemedCard className="w-full max-w-md mb-6 border-border/50">
          <View className="flex-row gap-4">
            {/* French Option */}
            <TouchableOpacity
              onPress={() => setLanguage('fr')}
              className={`flex-1 h-32 rounded-2xl items-center justify-center border ${language === 'fr'
                ? 'bg-surface border-primary'
                : 'bg-surface border-border/50'
                }`}
            >
              <FrenchFlag size={32} />
              <ThemedText className={`text-xs mt-4 text-center ${language === 'fr' ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                {t('settings.french')}
              </ThemedText>
            </TouchableOpacity>

            {/* English Option */}
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              className={`flex-1 h-32 rounded-2xl items-center justify-center border ${language === 'en'
                ? 'bg-surface border-primary'
                : 'bg-surface border-border/50'
                }`}
            >
              <EnglishFlag size={32} />
              <ThemedText className={`text-xs mt-4 text-center ${language === 'en' ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                {t('settings.english')}
              </ThemedText>
            </TouchableOpacity>

            {/* Malagasy Option */}
            <TouchableOpacity
              onPress={() => setLanguage('mg')}
              className={`flex-1 h-32 rounded-2xl items-center justify-center border ${language === 'mg'
                ? 'bg-surface border-primary'
                : 'bg-surface border-border/50'
                }`}
            >
              <MalagasyFlag size={32} />
              <ThemedText className={`text-xs mt-4 text-center ${language === 'mg' ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                {t('settings.malagasy')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedCard>

        <SectionHeader title={t('settings.appInfo')} />
        <ThemedCard className="w-full max-w-md mb-6 border-border/50">
          <View>
            <View className=" mb-4">
              <ThemedText className="text-on-surface-variant mb-2">
                {t('settings.version')}
              </ThemedText>
              <ThemedText className="font-medium">
                {Application.nativeApplicationVersion}
              </ThemedText>
            </View>

            <View className=" mb-4">
              <ThemedText className="text-on-surface-variant mb-2">
                {t('settings.developer')}
              </ThemedText>
              <ThemedText className="font-medium">
                ANHY Krishna Fitiavana (krishna2206)
              </ThemedText>
            </View>

            <View className="">
              <ThemedText className="text-on-surface-variant mb-2">
                {t('settings.projectLink')}
              </ThemedText>
              <ThemedButton
                variant="surface"
                onPress={handleGitHubPress}
                className="mt-2"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Ionicons name="logo-github" size={20} color={colors.onSurface} />
                  <ThemedText>{t('settings.viewOnGitHub')}</ThemedText>
                </View>
              </ThemedButton>
            </View>
          </View>
        </ThemedCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}