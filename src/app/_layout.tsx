import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Anton_400Regular: require('@expo-google-fonts/anton/400Regular/Anton_400Regular.ttf'),
    Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
    Inter_900Black_Italic: require('@expo-google-fonts/inter/900Black_Italic/Inter_900Black_Italic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B1126' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="game" options={{ gestureEnabled: false }} />
      <Stack.Screen name="game-over" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
