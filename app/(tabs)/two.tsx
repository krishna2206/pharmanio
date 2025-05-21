import { Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-purple-600 mb-4">Tab Two</Text>
      <Text className="text-gray-700 text-center">This tab is also styled with Tailwind classes.</Text>
    </View>
  );
}
