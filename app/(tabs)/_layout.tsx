import { IconOnlyTabBar } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ThemeColors } from '@/types/colors';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colors: ThemeColors = useThemeColors();
  
  return (
    <Tabs
      tabBar={props => <IconOnlyTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
        }}
      />
    </Tabs>
  );
}