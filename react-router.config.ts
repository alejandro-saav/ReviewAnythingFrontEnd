import type { Config } from "@react-router/dev/config";
import { GetLatestReviewIds } from "./src/services/ReviewService";
import { GetLatestUserIds } from "./src/services/UserService";
export default {
    appDirectory: "src/app",
    ssr: true,
    future: {
        v8_middleware: true,
    }

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
} satisfies Config;





