import { ThemedCard, ThemedText, ThemedView } from "@/components";

export default function TabTwoScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-6">
      <ThemedText className="text-secondary text-2xl font-bold mb-4">
        Tab Two
      </ThemedText>
      
      <ThemedCard className="w-full max-w-sm">
        <ThemedText className="text-center mb-4">
          This demonstrates the power of semantic color names:
        </ThemedText>
        
        <ThemedText className="text-primary mb-2">• text-primary</ThemedText>
        <ThemedText className="text-secondary mb-2">• text-secondary</ThemedText>
        <ThemedText className="text-on-surface mb-2">• text-on-surface</ThemedText>
        <ThemedText className="text-on-surface-variant">• text-on-surface-variant</ThemedText>
      </ThemedCard>
    </ThemedView>
  );
}