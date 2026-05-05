import { type ReactElement } from "react";
import Pagination from "../../components/Pagination";
import FilterReviews from "../../components/FilterReviews";
import ReviewCard from "../../components/ReviewCard";
import type { LikedReviews } from "../../types/ReviewTypes";
import { redirect, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router-dom";
import { FetchCategories, FetchUserReviews } from "../../services/ReviewService";
import { getRatingAverageFromReviews } from "../../utils/helperFunctions";
import styles from "./MyReviews.module.css";
import ReviewGrid from "../../components/ReviewGrid";
import { CATEGORIES_FALLBACK } from "../../utils/const";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookies: string[] | undefined = request.headers.get("Cookie")?.split(";");
    const accessToken: string | undefined = cookies?.find(c => c.substring(0, c.indexOf("=")).trim() == "accessToken");
    if (!accessToken) return redirect("/");
    const url = new URL(request.url);
    const categories = await FetchCategories();
    const rating = url.searchParams.get("rating");
    const reviews = await FetchUserReviews(url.search, accessToken.substring(accessToken.indexOf("=") + 1));
    return {
        reviews,
        categories,
        rating
    };
}


export const meta: MetaFunction = () => {
    return [
        { title: "My Reviews | ReviewAnything" },
        { name: "description", content: "View and manage all the reviews you have written on ReviewAnything." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/my-reviews" },
    ];
};

export default function MyReviews(): ReactElement {
    const { reviews, categories, rating } = useLoaderData<typeof loader>();
    return (
        <div className={styles.myreviewsContainer}>
            <div className={styles.myreviewsWrapper}>
                <div className={styles.header}>
                    <h1>My Reviews</h1>
                    <p>All your reviews in one place</p>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber} id="totalReviews">{reviews.length}</div>
                            <div className={styles.statLabel}>Total Reviews</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}
                                id="avgRating">{reviews.length > 0 ? getRatingAverageFromReviews(reviews) : 0}</div>
                            <div className={styles.statLabel}>Average Rating</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber} id="totalLikes">{reviews.length > 0 ? reviews.reduce((accumulator: number, next: LikedReviews) => accumulator + next.likes, 0) : 0}</div>
                            <div className={styles.statLabel}>Total Likes</div>
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
    )
}