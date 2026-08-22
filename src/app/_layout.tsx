import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { initAds, preloadInterstitial } from '@/lib/ads';
import { initSentry, RootComponent } from '@/lib/sentry';
import { I18nProvider } from '@/i18n/context';

// Initialize Sentry as early as possible
initSentry();

function RootLayoutInner() {
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
        <Stack.Screen name="levels" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
}

// Wrap with Sentry error boundary for crash reporting
const SentryRootLayout = RootComponent(RootLayoutInner);

export default function RootLayout() {
  return (
    <I18nProvider>
      <SentryRootLayout />
    </I18nProvider>
  );
}
