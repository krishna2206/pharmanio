import { ThemedButton, ThemedText, ThemedView } from '@/components';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView className="flex-1 items-center justify-center p-5">
        <ThemedText className="text-xl font-bold mb-4">
          {t('common.notFound')}
        </ThemedText>

        <Link href="/" asChild>
          <ThemedButton>
            {t('common.goHome')}
          </ThemedButton>
        </Link>
      </ThemedView>
    </>
  );
}