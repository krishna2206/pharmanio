import { themes } from '@/constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  colorScheme: 'system',
  setColorScheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme: systemColorScheme, setColorScheme: setNativeWindColorScheme } = useColorScheme();
  const [userColorScheme, setUserColorScheme] = useState<ColorScheme>('system');

  // Determine the actual theme based on user preference and system theme
  const currentTheme = userColorScheme === 'system' 
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : userColorScheme;
  const isDark = currentTheme === 'dark';

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setUserColorScheme(savedTheme as ColorScheme);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Update NativeWind color scheme when theme changes
  useEffect(() => {
    if (userColorScheme === 'system') {
      setNativeWindColorScheme('system');
    } else {
      setNativeWindColorScheme(userColorScheme);
    }
  }, [userColorScheme, setNativeWindColorScheme]);

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      setUserColorScheme(scheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme, 
      isDark, 
      colorScheme: userColorScheme,
      setColorScheme 
    }}>
      <View style={themes[currentTheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};