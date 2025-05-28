import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface TabConfig {
  [key: string]: {
    icon: ImageSourcePropType;
    iconActive?: ImageSourcePropType;
    labelKey: string;
    fallbackColor?: string;
  };
}

const tabConfig: TabConfig = {
  index: {
    icon: require('@/assets/images/3d-house.png'),
    iconActive: require('@/assets/images/3d-house.png'),
    labelKey: 'common.home',
    fallbackColor: '#FF6B6B'
  },
  demo: {
    icon: require('@/assets/images/3d-components.png'),
    iconActive: require('@/assets/images/3d-components.png'),
    labelKey: 'common.demo',
    fallbackColor: '#FF6B6B'
  },
  settings: {
    icon: require('@/assets/images/3d-cog.png'),
    iconActive: require('@/assets/images/3d-cog.png'),
    labelKey: 'common.settings',
    fallbackColor: '#4ECDC4'
  },
};

export function ImageTabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [animations] = useState(() =>
    state.routes.reduce((acc, route) => {
      acc[route.key] = {
        scale: new Animated.Value(1),
        translateY: new Animated.Value(0)
      };
      return acc;
    }, {} as Record<string, { scale: Animated.Value; translateY: Animated.Value }>)
  );

  const animateTab = (routeKey: string) => {
    const animation = animations[routeKey];
    if (!animation) return;

    animation.scale.setValue(1);
    animation.translateY.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(animation.translateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(animation.translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      paddingHorizontal: 2,
      paddingBottom: 20,
      pointerEvents: 'box-none',
    }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border + '40',
          borderRadius: 20,
          paddingTop: 5,
          paddingBottom: 5,
          marginHorizontal: 10,
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          height: 75,
        }}
      >
        {state.routes.map((route, index) => {
          const config = tabConfig[route.name];
          const isFocused = state.index === index;
          const animation = animations[route.key];

          if (!config) {
            console.warn(`No tab config found for route: ${route.name}`);
            return null;
          }

          const onPress = () => {
            animateTab(route.key);

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconSource = isFocused && config.iconActive ? config.iconActive : config.icon;
          const imageKey = `${route.name}-${isFocused ? 'active' : 'normal'}`;
          const hasImageFailed = failedImages.has(imageKey);

          const handleImageError = () => {
            console.log('Image failed to load for route:', route.name);
            setFailedImages(prev => new Set(prev).add(imageKey));
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: 65,
                borderRadius: 20,
                marginHorizontal: 8,
                overflow: 'visible',
              }}
            >
              <Animated.View style={{
                position: 'absolute',
                top: -25,
                alignItems: 'center',
                transform: [
                  { scale: animation?.scale || 1 },
                  { translateY: animation?.translateY || 0 }
                ],
              }}>
                {hasImageFailed ? (
                  <View
                    style={{
                      width: 65,
                      height: 65,
                      backgroundColor: config.fallbackColor || colors.primary,
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  <Image
                    source={iconSource}
                    style={{
                      width: 65,
                      height: 65,
                    }}
                    resizeMode="contain"
                    onError={handleImageError}
                  />
                )}
              </Animated.View>
              <ThemedText
                className="text-sm font-medium"
                style={{
                  color: isFocused ? colors.tabActive : colors.tabInactive,
                  position: 'absolute',
                  bottom: 5,
                }}
              >
                {t(config.labelKey)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}