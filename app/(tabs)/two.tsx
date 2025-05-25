import { ThemedCard, ThemedText, ThemedView } from "@/components";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ScrollView, View } from "react-native";

export default function TabTwoScreen() {
  const colors = useThemeColors();
  
  // Generate multiple items to ensure content goes under the tab bar
  const items = Array.from({ length: 20 }, (_, i) => i + 1);
  
  return (
    <ThemedView className="flex-1">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
      >
        <ThemedText className="text-secondary text-2xl font-bold mb-4">
          Tab two
        </ThemedText>
        
        <ThemedCard className="w-full max-w-sm mb-4">
          <ThemedText className="text-center mb-4">
            This demonstrates the power of semantic color names:
          </ThemedText>
          
          <ThemedText className="text-primary mb-2">• text-primary</ThemedText>
          <ThemedText className="text-secondary mb-2">• text-secondary</ThemedText>
          <ThemedText className="text-on-surface mb-2">• text-on-surface</ThemedText>
          <ThemedText className="text-on-surface-variant mb-2">• text-on-surface-variant</ThemedText>
        </ThemedCard>
        
        {/* Add more content to scroll under the tab bar */}
        {items.map(item => (
          <View 
            key={item} 
            style={{ 
              padding: 16, 
              marginBottom: 12, 
              backgroundColor: colors.surface,
              borderRadius: 12,
            }}
          >
            <ThemedText className="text-on-secondary-container font-medium">
              Item #{item} - This content will scroll under the tab bar
            </ThemedText>
          </View>
        ))}
        
        {/* Add padding at the bottom to ensure content is visible above the tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}