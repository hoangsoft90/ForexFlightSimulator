import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBannerAdUnitId, isNative } from '@/lib/ads';
import { colors } from '@/constants/theme';

// Lazy-load BannerAd component only on native
const BannerAdComponent = Platform.select({
  native: (() => {
    try {
      return require('react-native-google-mobile-ads').BannerAd;
    } catch {
      return null;
    }
  })(),
  default: null,
});

interface AdBannerProps {
  size?: string;
  /** If true, render inline (inside ScrollView). Default: fixed at bottom. */
  inline?: boolean;
}

export function AdBanner({ size, inline }: AdBannerProps) {
  const [failed, setFailed] = useState(false);
  const insets = useSafeAreaInsets();

  // No ads on web or if component failed to load
  if (!isNative || !BannerAdComponent || failed) return null;

  const adUnitId = getBannerAdUnitId();
  if (!adUnitId) return null;

  // Fixed banner: sits above system nav bar (bottom inset) + gesture indicator
  if (!inline) {
    return (
      <View style={[styles.fixedContainer, { paddingBottom: insets.bottom }]}>
        <BannerAdComponent
          unitId={adUnitId}
          size={size ?? 'ANCHORED_ADAPTIVE_BANNER'}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={() => setFailed(true)}
        />
      </View>
    );
  }

  // Inline banner (inside ScrollView content)
  return (
    <View style={styles.inlineContainer}>
      <BannerAdComponent
        unitId={adUnitId}
        size={size ?? 'ANCHORED_ADAPTIVE_BANNER'}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 4,
    // elevation + shadow for visual separation
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inlineContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: 4,
  },
});
