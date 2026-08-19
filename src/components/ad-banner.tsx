import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
}

export function AdBanner({ size }: AdBannerProps) {
  const [failed, setFailed] = useState(false);

  // No ads on web or if component failed to load
  if (!isNative || !BannerAdComponent || failed) return null;

  const adUnitId = getBannerAdUnitId();
  if (!adUnitId) return null;

  return (
    <View style={styles.container}>
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
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: 4,
  },
});
