import { sentryOnBuildEnd } from "@sentry/react-router";
import type { Config } from "@react-router/dev/config";
import { GetLatestReviewIds } from "./src/services/ReviewService";
import { GetLatestUserIds } from "./src/services/UserService";
export default {
    appDirectory: "src/app",

    // async prerender() {
    //     let reviewRoutes: string[] = [];
    //     let userRoutes: string[] = [];
    //     const reviewIdsResponse = await GetLatestReviewIds();
    //     const userIdsResponse = await GetLatestUserIds();
    //     if (reviewIdsResponse != null) {
    //         reviewRoutes = reviewIdsResponse.map((r: number) => `/review/${r}`);
    //     }
    //     if (userIdsResponse != null) {
    //         userRoutes = userIdsResponse.map((u: number) => `user/${u}`);
    //     }
    //     return ["/", "explorecategories", "login", "signup", "email-confirmation-required", "confirm-email", ...reviewRoutes, ...userRoutes]
    // },
    ssr: true,

    buildEnd: async (
        {
            viteConfig: viteConfig,
            reactRouterConfig: reactRouterConfig,
            buildManifest: buildManifest
        }
    ) => {
        await sentryOnBuildEnd({
            viteConfig: viteConfig,
            reactRouterConfig: reactRouterConfig,
            buildManifest: buildManifest
        });
    }
} satisfies Config;
