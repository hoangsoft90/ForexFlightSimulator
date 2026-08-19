import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { initAds, preloadInterstitial } from '@/lib/ads';

export default function RootLayout() {
  useEffect(() => {
    initAds();
    preloadInterstitial();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="decision" />
        <Stack.Screen name="autopsy" />
      </Stack>
    </SafeAreaProvider>
  );
}
