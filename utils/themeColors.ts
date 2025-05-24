import { colorDefinitions } from '@/constants/themes';
import { ThemeColors } from '@/types/colors';

type ColorKey = keyof typeof colorDefinitions.light;

export function getThemeColors(theme: 'light' | 'dark'): ThemeColors {
  const themeVars = colorDefinitions[theme];
  
  const colors = {} as ThemeColors;
  
  Object.entries(themeVars).forEach(([key, value]) => {
    const camelCaseKey = key
      .replace('--color-', '')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    
    colors[camelCaseKey as keyof ThemeColors] = value;
  });
  
  return colors;
}

export function getThemeColor(colorKey: ColorKey, theme: 'light' | 'dark'): string {
  return colorDefinitions[theme][colorKey];
}