import * as Sentry from '@sentry/react-native';
import { config } from '@/config';

export function initSentry() {
  Sentry.init({
    dsn: config.sentryDsn,
    debug: false, // never debug in production
    environment: config.testAds ? 'development' : 'production',
    tracesSampleRate: 0.2, // 20% of transactions for performance
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    // Don't send PII
    sendDefaultPii: false,
    // Before send: strip any sensitive data
    beforeSend(event) {
      // Remove any environment variables or tokens that might leak
      if (event.extra) {
        delete event.extra.env;
        delete event.extra.token;
      }
      return event;
    },
  });
}

/** Wrap root component for crash reporting */
export const RootComponent = Sentry.wrap;
