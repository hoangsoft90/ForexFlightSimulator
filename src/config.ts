/**
 * App configuration — AdMob settings.
 *
 * test_ads=true by default — uses Google test IDs to avoid policy violations.
 * Set test_ads = false before production release.
 */

export const config = {
  /** Master switch — when false, all ads are disabled (no banner, no interstitial, no rewarded). */
  enableAds: false,

  /** When true, uses Google's test ad unit IDs (no real ads, no policy risk). Only matters when enableAds=true. */
  testAds: true,

  /** Sentry DSN for crash reporting. */
  sentryDsn: 'https://4522baf79fccfb0dd3ec00c8e4b73018@o4505474077753344.ingest.us.sentry.io/4511948214304768',

  /** Real ad unit IDs — only used when testAds = false. */
  adUnits: {
    app: {
      android: 'ca-app-pub-6917313063209470~6649126214',
    },
    banner: {
      android: 'ca-app-pub-6917313063209470/5870552545',
      ios: 'ca-app-pub-6917313063209470/5870552545',
    },
    interstitial: {
      android: 'ca-app-pub-6917313063209470/6373899247',
      ios: 'ca-app-pub-6917313063209470/6373899247',
    },
    rewarded: {
      android: 'ca-app-pub-6917313063209470/8177935507',
      ios: 'ca-app-pub-6917313063209470/8177935507',
    },
  },
} as const;
