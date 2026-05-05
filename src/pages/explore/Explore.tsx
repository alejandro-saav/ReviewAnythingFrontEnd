import { type ReactElement } from "react"
import Pagination from "../../components/Pagination";
import FilterReviews from "../../components/FilterReviews";
import ReviewCard from "../../components/ReviewCard";
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction, } from "react-router-dom";
import type { LikedReviews } from "../../types/ReviewTypes";
import styles from "./Explore.module.css";
import ReviewGrid from "../../components/ReviewGrid";
import { FetchCategories, GetExploreReviewPageData } from "../../services/ReviewService";
import { CATEGORIES_FALLBACK } from "../../utils/const";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const categories = await FetchCategories();
    const rating = url.searchParams.get("rating");
    const reviews = await GetExploreReviewPageData(url.search);
    return {
        reviews: reviews,
        categories,
        rating
    };
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
    const params: URLSearchParams = new URLSearchParams(location.search);
    const category: string | null = params.get("category");
    const title: string = category
        ? `${category} Reviews | ReviewAnything`
        : "Explore Reviews | ReviewAnything";

    const description: string = category
        ? `Discover authentic ${category} reviews from our community.`
        : "Discover authentic reviews from our community on books, movies, technology and more.";

    const canonical = `https://reviewanything.site/explore`;
    return [
        { title },
        { name: "description", content: description },
        {
            "script:ld+json": {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Explore Reviews",
                "hasPart": data?.reviews?.map((review: LikedReviews) => ({
                    "@type": "Review",
                    "author": { "@type": "Person", "name": review.user?.userName },
                    "reviewRating": { "@type": "Rating", "ratingValue": review.rating, "bestRating": "5" },
                    "reviewBody": review.content,
                }))
            }
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://reviewanything.site/explore" },
        { property: "og:image", content: "https://reviewanything.site/review_anything_1200x630.png" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { tagName: "link", rel: "canonical", href: canonical },

    ];
};

export default function Explore(): ReactElement {
    const { reviews, categories, rating } = useLoaderData<typeof loader>();
    return (
        <div className={styles.exploreContainer}>
            <div className={styles.exploreWrapper}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Explore Reviews</h1>
                    <p className={styles.pageSubtitle}>Discover authentic reviews from our community. Find insights on books, movies,
                        technology, and everything in between.</p>
                </div>
                <div className={styles.contentContainer}>
                    <FilterReviews categories={categories || CATEGORIES_FALLBACK} rating={rating} />
                    {reviews.length > 0 ?
                        <ReviewGrid>
                            {reviews.map((review: LikedReviews, index: number) => <ReviewCard key={index} review={review} />)}
                        </ReviewGrid>
                        : <div className={styles.errorMessage}>Something went wrong while loading the reviews, please try reloading the page.</div>}
                </div>
                {reviews.length > 0 && <Pagination totalReviews={reviews[0].total} />}
            </div>
        </div>

    );
}