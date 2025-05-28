import { ThemedText, ThemedView } from "@/components";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1 flex-col justify-center items-center p-6">
      <ThemedText className="text-primary text-4xl font-bold mb-4">
        {t('common.hello')}
      </ThemedText>

      <ThemedText className="text-on-surface-variant text-center mb-8">
        {t('home.subtitle')}
      </ThemedText>
    </ThemedView>
  );
}