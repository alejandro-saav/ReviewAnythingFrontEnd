import * as Sentry from '@sentry/react-router';
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router-dom";
import './index.css'
const tracing = Sentry.reactRouterTracingIntegration({ useInstrumentationAPI: true });
Sentry.init({
    dsn: "https://997d5665acbe967fe4ec83e2bcca6048@o4511519947751424.ingest.us.sentry.io/4511519950307328",

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    integrations: [
        tracing
    ],

    // Enable logs to be sent to Sentry
    enableLogs: true,

    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // tracesSampler: (samplingContext) => {
    //     console.log("SAMPLING_CONTEXT:", samplingContext);
    //     console.log("??", samplingContext.name);
    //     if (samplingContext.name?.includes(".tsx")) {
    //         return 0;
    //     }
    //     return 1.0;
    // },

    // Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
    // In production, replace "yourserver.io" with your actual backend domain
    tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
});

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <HydratedRouter unstable_instrumentations={[tracing.clientInstrumentation]} />
        </StrictMode>
    )
})