import styles from "./LikedReviews.module.css"
import { type ReactElement } from "react";
import { type LikedReviews } from "../../types/ReviewTypes";
import Pagination from "../../components/Pagination";
import { redirect, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router-dom";
import { FetchCategories, FetchLikedReviews } from "../../services/ReviewService";
import ReviewCard from "../../components/ReviewCard";
import FilterReviews from "../../components/FilterReviews";
import ReviewGrid from "../../components/ReviewGrid";
import { getRatingAverageFromReviews } from "../../utils/helperFunctions";
import { CATEGORIES_FALLBACK } from "../../utils/const";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookies: string[] | undefined = request.headers.get("Cookie")?.split(";");
    const accessToken: string | undefined = cookies?.find(c => c.substring(0, c.indexOf("=")).trim() == "accessToken");
    if (!accessToken) return redirect("/");
    const url = new URL(request.url);
    const categories = await FetchCategories();
    const rating = url.searchParams.get("rating");
    const reviews = await FetchLikedReviews(url.search, accessToken.substring(accessToken.indexOf("=") + 1));
    return {
        reviews,
        categories,
        rating
    };
}

export const meta: MetaFunction = () => {
    return [
        { title: "Liked Reviews | ReviewAnything" },
        { name: "description", content: "View all the reviews you have liked on ReviewAnything." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/liked-reviews" },
    ];
};

export default function LikedReviews(): ReactElement {
    const { reviews, categories, rating } = useLoaderData<typeof loader>();

    return (
        <>
            <div className={styles.likereviewsContainer}>
                <div className={styles.likereviewsWrapper}>
                    <div className={styles.header}>
                        <h1>♥ Liked Reviews</h1>
                        <p>Reviews you've liked from the community</p>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{reviews.length}</div>
                                <div className={styles.statLabel}>Reviews Liked</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{new Set(reviews.map((review: any) => review.user?.userName)).size}</div>
                                <div className={styles.statLabel}>Different Authors</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{reviews.length > 0 ? getRatingAverageFromReviews(reviews) : 0}</div>
                                <div className={styles.statLabel}>Avg Rating</div>
                            </div>
                        </div>
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
        </>
    );
}