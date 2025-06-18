import { PermissionProvider } from '@/contexts/PermissionContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks';
import { ThemeColors } from '@/types/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <PermissionProvider>
        <ThemedNavigationStack />
      </PermissionProvider>
    </ThemeProvider>
  );
}

function ThemedNavigationStack() {
  const colors: ThemeColors = useThemeColors();

  // Set system UI background color based on theme
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <>
      <RootStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            animation: 'fade',
          }}
        />
      </Stack>
    </>
  );
}

function RootStatusBar() {
  const { isDark } = useTheme();

  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}
