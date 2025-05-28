import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface TabConfig {
  [key: string]: {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    labelKey: string;
  };
}

const tabConfig: TabConfig = {
  index: { icon: 'home', labelKey: 'common.home' },
  demo: { icon: 'eye', labelKey: 'common.demo' },
  settings: { icon: 'cog', labelKey: 'common.settings' },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: 20,
        paddingTop: 10,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const config = tabConfig[route.name];
        const isFocused = state.index === index;

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
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 12,
              marginHorizontal: 8,
              backgroundColor: isFocused ? colors.primary + '20' : 'transparent',
            }}
          >
            <FontAwesome
              name={config.icon}
              size={24}
              color={isFocused ? colors.tabActive : colors.tabInactive}
            />
            <ThemedText
              className="text-xs mt-1 font-medium"
              style={{
                color: isFocused ? colors.tabActive : colors.tabInactive
              }}
            >
              {t(config.labelKey)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}