import * as Sentry from '@sentry/react-router';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: "https://997d5665acbe967fe4ec83e2bcca6048@o4511519947751424.ingest.us.sentry.io/4511519950307328",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  integrations: [nodeProfilingIntegration()],
  // tracesSampleRate: 1.0, // Capture 100% of the transactions
  tracesSampler: (samplingContext) => {
    const ignored = [".tsx", ".ts", "/favicon.ico", "/_static/", "site.webmanifest", "@vite/client"];
    if (ignored.some(item => samplingContext.name?.includes(item))) return 0;
    return 1.0;
  },
  profilesSampleRate: 1.0, // profile every transaction

  // Set up performance monitoring
  beforeSend(event) {
    // Filter out 404s from error reporting
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === "NotFoundException" || error?.value?.includes("404")) {
        return null;
      }
    }
    return event;
  },
});