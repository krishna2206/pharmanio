import { useThemeColors } from '@/hooks/useThemeColors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabConfig {
  [key: string]: {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
  };
}

const tabConfig: TabConfig = {
  index: {
    icon: 'home'
  },
  demo: {
    icon: 'eye'
  },
  settings: {
    icon: 'cog'
  },
};

export function IconOnlyTabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-row bg-surface border-t border-border/50">
      {state.routes.map((route, index) => {
        const config = tabConfig[route.name];
        const isFocused = state.index === index;
        const extraPaddingBottom = Platform.OS === "android" ? 6 : 0;

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
            className="flex-1 items-center justify-center py-4"
            style={{ paddingBottom: insets.bottom + extraPaddingBottom }}
          >
            <FontAwesome
              name={config.icon}
              size={28}
              color={isFocused ? colors.tabActive : colors.tabInactive}
            />
          </Pressable>
        );
      })}
    </View>
  );
}