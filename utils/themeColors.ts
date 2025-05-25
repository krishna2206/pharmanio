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
    
    // Convert RGB string to hex format
    const rgbValues = value.split(' ').map((v: string) => parseInt(v.trim()));
    const hexColor = `#${rgbValues.map((v: number) => v.toString(16).padStart(2, '0')).join('')}`;
    
    colors[camelCaseKey as keyof ThemeColors] = hexColor;
  });
  
  return colors;
}

export function getThemeColor(colorKey: ColorKey, theme: 'light' | 'dark'): string {
  return colorDefinitions[theme][colorKey];
}