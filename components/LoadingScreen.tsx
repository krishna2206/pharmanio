import { useThemeColors } from '@/hooks';
import { ThemeColors } from '@/types/colors';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';

export default function LoadingScreen() {
  const colors: ThemeColors = useThemeColors();

  return (
    <ThemedView className='flex-1 justify-center items-center'>
      <ActivityIndicator size='large' color={colors.primary} />
    </ThemedView>
  )
}