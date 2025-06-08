import { useThemeColors } from '@/hooks/useThemeColors';
import { Asclepius } from 'phosphor-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ThemedHeaderProps {
  title?: string;
  className?: string;
}

export function ThemedHeader({
  title = 'PharmAnio',
  className = ''
}: ThemedHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <ThemedView
      className={`${className}`}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-center py-4 px-6">
        <Asclepius
          size={32}
          color={colors.primary}
          weight='bold'
        />
        <ThemedText className="text-xl font-bold text-primary ml-3">
          {title}
        </ThemedText>
      </View>
    </ThemedView>
  );
}