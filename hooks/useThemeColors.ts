import { useTheme } from '@/contexts/ThemeContext';
import { ThemeColors } from '@/types/colors';
import { getThemeColors } from '@/utils/themeColors';
import { useEffect, useState } from 'react';

export function useThemeColors(): ThemeColors {
  const { theme } = useTheme();
  const [colors, setColors] = useState(() => getThemeColors(theme));
  
  useEffect(() => {
    setColors(getThemeColors(theme));
  }, [theme]);
  
  return colors;
}