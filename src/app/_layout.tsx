import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="game" options={{ gestureEnabled: false }} />
      <Stack.Screen name="game-over" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
