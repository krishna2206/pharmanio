import { BlurTabBar, ThemedHeader } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeColors } from '@/types/colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  const colors: ThemeColors = useThemeColors();
  const { t } = useTranslation();

  return (
    <View className='flex-1'>
      <ThemedHeader title='PharmAnio' />

      <Tabs
        tabBar={props => <BlurTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: colors.surface, },
          headerTintColor: colors.onSurface,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('common.home'),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('common.settings'),
          }}
        />
      </Tabs>
    </View>
  );
}