/// <reference types="@lunar-kit/css/types" />
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { Button } from './components/ui/button';

export default function Main() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-bold text-slate-900 mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="text-slate-600 mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => alert('Hello Lunar Kit!')}>
        Get Started
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}
