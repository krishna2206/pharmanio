import { Text, View } from "react-native";

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-bold text-blue-500 mb-4">Tab One</Text>
      <Text className="text-gray-700 text-center">NativeWind setup is complete! This text is styled with Tailwind classes.</Text>
    </View>
  );
}
