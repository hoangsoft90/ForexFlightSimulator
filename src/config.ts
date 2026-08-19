/**
 * App configuration — AdMob settings.
 *
 * MVP: test_ads=true by default.
 * Before deploying to stores:
 *   1. Set test_ads = false
 *   2. Replace ad unit IDs below with your real AdMob IDs
 *   3. Update App IDs in app.json (androidAppId / iosAppId)
 */

export const config = {
  /** When true, uses Google's test ad unit IDs (no real ads, no policy risk). */
  testAds: true,

  /** Real ad unit IDs — only used when testAds = false. */
  adUnits: {
    banner: {
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    interstitial: {
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
  },
} as const;
