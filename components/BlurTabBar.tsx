import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface TabConfig {
  [key: string]: {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    label: string;
  };
}

const tabConfig: TabConfig = {
  index: { 
    icon: 'home',
    label: 'Home' 
  },
  two: { 
    icon: 'search',
    label: 'Search' 
  },
};

export function BlurTabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Use BlurView on iOS for blur effect, ThemedView on Android for opaque background
  const TabBarBackground = Platform.OS === 'ios' ? BlurView : ThemedView;
  const backgroundProps = Platform.OS === 'ios' 
    ? { intensity: 50, tint: (theme === 'dark' ? 'dark' : 'light') as 'light' | 'dark' }
    : {};

  return (
    <TabBarBackground 
      {...backgroundProps} 
      className={`absolute bottom-0 left-0 right-0 border-t border-border/50`}
      style={{ height: 55 + insets.bottom }}
    >
      <View className="flex flex-row justify-around items-center flex-1 pt-2 pb-safe">
        {state.routes.map((route, index) => {
          const config = tabConfig[route.name];
          const isFocused = state.index === index;

          if (!config) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center py-2"
            >
              <View className="items-center">
                <FontAwesome 
                  name={config.icon}
                  size={24}
                  color={isFocused ? colors.primary : colors.onBackground + '99'}
                  className="mb-1"
                />
                <ThemedText 
                  className="text-xs"
                  style={{ color: isFocused ? colors.primary : colors.onBackground + '99' }}
                >
                  {config.label}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </TabBarBackground>
  );
}