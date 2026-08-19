import { Platform } from 'react-native';
import { config } from '@/config';

// ─── Platform guard ──────────────────────────────────────────────────────────
// react-native-google-mobile-ads is native-only.
// Use Platform.select to completely exclude the import on web —
// Metro still resolves require() inside if-blocks, so we must use select.

const isNative = Platform.OS === 'android' || Platform.OS === 'ios';

// This object is empty on web, populated on native
const nativeAds = Platform.select({
  native: (() => {
    try {
      return require('react-native-google-mobile-ads');
    } catch {
      return null;
    }
  })(),
  default: null,
});

const mobileAds = nativeAds?.default ?? nativeAds?.MobileAds;
const InterstitialAd = nativeAds?.InterstitialAd;
const AdEventType = nativeAds?.AdEventType;
const TestIds = nativeAds?.TestIds;
const BannerAdSizeNative = nativeAds?.BannerAdSize;

// ─── Ad Unit Resolution ──────────────────────────────────────────────────────

const platform = Platform.OS as 'android' | 'ios';

export function getBannerAdUnitId(): string {
  if (!isNative || !TestIds) return '';
  if (config.testAds) return TestIds.ADAPTIVE_BANNER;
  return config.adUnits.banner[platform];
}

export function getInterstitialAdUnitId(): string {
  if (!isNative || !TestIds) return '';
  if (config.testAds) return TestIds.INTERSTITIAL;
  return config.adUnits.interstitial[platform];
}

// ─── Initialization ──────────────────────────────────────────────────────────

let initialized = false;

export async function initAds(): Promise<void> {
  if (!isNative || !mobileAds || initialized) return;
  try {
    await mobileAds().initialize();
    initialized = true;
  } catch (e) {
    console.warn('[Ads] Initialization failed:', e);
  }
}

// ─── Interstitial ────────────────────────────────────────────────────────────

let interstitialInstance: any = null;
let interstitialLoaded = false;

/**
 * Preload an interstitial ad. Call this early (e.g. on Home screen mount)
 * so it's ready when the user finishes an autopsy.
 */
export function preloadInterstitial(): void {
  if (!isNative || !InterstitialAd || !AdEventType || interstitialLoaded) return;

  const adUnitId = getInterstitialAdUnitId();
  if (!adUnitId) return;

  interstitialInstance = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  interstitialInstance.addAdEventListener(AdEventType.LOADED, () => {
    interstitialLoaded = true;
  });

  interstitialInstance.addAdEventListener(AdEventType.CLOSED, () => {
    interstitialLoaded = false;
    interstitialInstance = null;
  });

  interstitialInstance.addAdEventListener(AdEventType.ERROR, () => {
    interstitialLoaded = false;
    interstitialInstance = null;
  });

  interstitialInstance.load();
}

/**
 * Show the preloaded interstitial. Returns true if shown, false if not ready.
 */
export function showInterstitial(): boolean {
  if (!interstitialInstance || !interstitialLoaded) return false;

  interstitialInstance.show();
  interstitialLoaded = false;
  interstitialInstance = null;
  return true;
}

// ─── Constants re-export ─────────────────────────────────────────────────────

/** Safe re-export — returns undefined on web */
export const BannerAdSize = BannerAdSizeNative;

/** Whether native ads module is available */
export { isNative };
