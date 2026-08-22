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

  /** Sentry DSN for crash reporting. */
  sentryDsn: 'https://4522baf79fccfb0dd3ec00c8e4b73018@o4505474077753344.ingest.us.sentry.io/4511948214304768',

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
