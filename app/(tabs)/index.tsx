import { ThemedButton, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabOneScreen() {
  const { theme, isDark, colorScheme, setColorScheme } = useTheme();
  
  return (
    <ThemedView className="flex-1 items-center justify-center p-6">
      <ThemedText className="text-primary text-2xl font-bold mb-4">
        Tab One
      </ThemedText>
      
      <ThemedText className="text-on-surface-variant text-center mb-8">
        Clean NativeWind theme implementation with semantic color names!
      </ThemedText>
      
      <ThemedCard className="w-full max-w-xs">
        <ThemedText className="font-semibold mb-4 text-center">
          Theme Settings
        </ThemedText>
        
        <ThemedButton 
          variant={colorScheme === 'light' ? 'primary' : 'surface'}
          onPress={() => setColorScheme('light')}
          className="mb-3"
        >
          Light Theme
        </ThemedButton>
        
        <ThemedButton 
          variant={colorScheme === 'dark' ? 'primary' : 'surface'}
          onPress={() => setColorScheme('dark')}
          className="mb-3"
        >
          Dark Theme
        </ThemedButton>
        
        <ThemedButton 
          variant={colorScheme === 'system' ? 'primary' : 'surface'}
          onPress={() => setColorScheme('system')}
          className="mb-4"
        >
          System Default
        </ThemedButton>
        
        <ThemedText className="text-on-surface-variant text-center text-sm">
          Current: {colorScheme} ({theme} theme {isDark ? '- dark mode' : '- light mode'})
        </ThemedText>
      </ThemedCard>
    </ThemedView>
  );
}