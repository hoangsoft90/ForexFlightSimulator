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
const RewardedAd = nativeAds?.RewardedAd;
const AdEventType = nativeAds?.AdEventType;
const TestIds = nativeAds?.TestIds;
const BannerAdSizeNative = nativeAds?.BannerAdSize;

// ─── Ad Unit Resolution ──────────────────────────────────────────────────────

const platform = Platform.OS as 'android' | 'ios';

export function getBannerAdUnitId(): string {
  if (!isNative || !TestIds || !config.enableAds) return '';
  if (config.testAds) return TestIds.ADAPTIVE_BANNER;
  return config.adUnits.banner[platform];
}

export function getInterstitialAdUnitId(): string {
  if (!isNative || !TestIds || !config.enableAds) return '';
  if (config.testAds) return TestIds.INTERSTITIAL;
  return config.adUnits.interstitial[platform];
}

export function getRewardedAdUnitId(): string {
  if (!isNative || !TestIds || !config.enableAds) return '';
  if (config.testAds) return TestIds.REWARDED;
  return config.adUnits.rewarded[platform];
}

// ─── Initialization ──────────────────────────────────────────────────────────

let initialized = false;

export async function initAds(): Promise<void> {
  if (!isNative || !mobileAds || !config.enableAds || initialized) return;
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
  if (!isNative || !InterstitialAd || !AdEventType || !config.enableAds || interstitialLoaded) return;

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

// ─── Rewarded Ad ──────────────────────────────────────────────────────────

let rewardedInstance: any = null;
let rewardedLoaded = false;
let rewardedCallback: (() => void) | null = null;

/**
 * Preload a rewarded ad.
 */
export function preloadRewarded(): void {
  if (!isNative || !RewardedAd || !AdEventType || !config.enableAds || rewardedLoaded) return;

  const adUnitId = getRewardedAdUnitId();
  if (!adUnitId) return;

  rewardedInstance = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  rewardedInstance.addAdEventListener(AdEventType.LOADED, () => {
    rewardedLoaded = true;
  });

  rewardedInstance.addAdEventListener(AdEventType.EARNED_REWARD, () => {
    rewardedCallback?.();
    rewardedCallback = null;
  });

  rewardedInstance.addAdEventListener(AdEventType.CLOSED, () => {
    rewardedLoaded = false;
    rewardedInstance = null;
  });

  rewardedInstance.addAdEventListener(AdEventType.ERROR, () => {
    rewardedLoaded = false;
    rewardedInstance = null;
  });

  rewardedInstance.load();
}

/**
 * Show the preloaded rewarded ad. Calls `onRewarded` when user earns the reward.
 * Returns true if shown, false if not ready.
 */
export function showRewarded(onRewarded: () => void): boolean {
  if (!rewardedInstance || !rewardedLoaded) return false;

  rewardedCallback = onRewarded;
  rewardedInstance.show();
  rewardedLoaded = false;
  rewardedInstance = null;
  return true;
}

// ─── Constants re-export ─────────────────────────────────────────────────────

/** Safe re-export — returns undefined on web */
export const BannerAdSize = BannerAdSizeNative;

/** Whether native ads module is available */
export { isNative };
