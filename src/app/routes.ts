import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
    layout("./layout/MainLayout.tsx", [

        index("../pages/home/Home.tsx"),
        route("review/:reviewId", "../pages/review/Review.tsx"),
        route("explore", "../pages/explore/Explore.tsx"),
        route("explore-categories", "../pages/explore-categories/ExploreCategories.tsx"),
        route("profile/:userId", "../pages/profile/Profile.tsx"),
        route("*", "../pages/notfound/NotFound.tsx"),
        route("terms-of-service", "../pages/Legal/TermsOfService.tsx"),
        route("privacy-policy", "../pages/Legal/PrivacyPolicy.tsx"),
        route("community-guidelines", "../pages/Legal/CommunityGuidelines.tsx"),
        route("DMCAPolicy", "../pages/Legal/DMCAPolicy.tsx"),
        route("logout", "../pages/Auth/logout/Logout.tsx"),

        layout("./layout/ProtectedRoutes.tsx", [
            route("write-review", "../pages/write-review/WriteReview.tsx"),
            route("edit-profile", "../pages/edit-profile/EditProfile.tsx"),
            route("my-reviews", "../pages/myreviews/MyReviews.tsx"),
            route("my-comments", "../pages/mycomments/MyComments.tsx"),
            route("liked-reviews", "../pages/liked-reviews/LikedReviews.tsx"),

        ])
    ]),

    route("login", "../pages/Auth/login/Login.tsx"),
    route("signup", "../pages/Auth/signup/SignUp.tsx"),
    route("email-confirmation-required", "../pages/Auth/email-confirmation-required/EmailConfirmationRequired.tsx"),
    route("confirm-email", "../pages/Auth/confirm-email/ConfirmEmail.tsx"),
    route("forgot-password", "../pages/Auth/forgot-password/ForgotPassword.tsx"),
    route("reset-password", "../pages/Auth/resetpassword/ResetPassword.tsx")
] satisfies RouteConfig;