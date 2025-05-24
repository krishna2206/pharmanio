import { ThemedButton, ThemedText, ThemedView } from '@/components';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView className="flex-1 items-center justify-center p-5">
        <ThemedText className="text-xl font-bold mb-4">
        This screen doesn&apos;t exist.
        </ThemedText>

        <Link href="/" asChild>
          <ThemedButton>
            Go to home screen!
          </ThemedButton>
        </Link>
      </ThemedView>
    </>
  );
}