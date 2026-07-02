import type { Category, CommentVoteRequest, LikedReviews, ReviewPageData, Comment, WriteReviewModel, ReviewModel } from "../types/ReviewTypes";
import { BASE_API_URL } from "../utils/const";
import * as Sentry from "@sentry/react-router";

export async function FetchCategories(): Promise<Category[] | null> {
    try {
        const response = await fetch(BASE_API_URL + "/api/categories");
        if (!response.ok) throw Object.assign(new Error("categories.load.failed"), {
            status: response.status,
        });
        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function FetchLikedReviews(queryString: string, authToken: string): Promise<LikedReviews[]> {
    try {
        const response = await fetch(BASE_API_URL + `/api/reviews/liked-reviews${queryString}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw Object.assign(new Error("liked_reviews.load.failed"), {
            status: response.status,
        });
        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return [];
    }
}

export async function FetchUserReviews(queryString: string, authToken: string): Promise<LikedReviews[]> {
    try {
        const response = await fetch(BASE_API_URL + `/api/reviews/myreviews${queryString}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw Object.assign(new Error("user_reviews.load.failed"), {
            status: response.status,
        });
        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return [];
    }
}

export async function FetchReviewPageData(reviewId: number, accessToken: string | null): Promise<ReviewPageData | null> {
    try {
        const response = await fetch(BASE_API_URL + `/api/reviews/${reviewId}/page-data`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) throw Object.assign(new Error("review_paga_data.load.failed"), {
            status: response.status,
        });
        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function PostCommentVote(commentVote: CommentVoteRequest): Promise<boolean> {
    try {
        const response = await fetch(BASE_API_URL + `/api/comment/comment-votes`, {
            method: "POST",
            body: JSON.stringify(commentVote),
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw Object.assign(new Error("comment_vote.post.failed"), {
            status: response.status,
        });

        return true;
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export async function PostComment(reviewId: number, comment: string, authToken: string): Promise<Comment | null> {
    try {
        const response = await fetch(BASE_API_URL + `/api/comment`, {
            method: "POST",
            body: JSON.stringify({ ReviewId: reviewId, Content: comment }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw Object.assign(new Error("comment.post.failed"), {
            status: response.status,
        });

        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function PostReviewVote(reviewId: number, voteType: number, authToken: string): Promise<number | null> {
    try {
        const response = await fetch(BASE_API_URL + `/api/reviews/review-votes`, {
            method: "POST",
            body: JSON.stringify({ ReviewId: reviewId, VoteType: voteType }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw Object.assign(new Error("review_vote.post.failed"), {
            status: response.status,
        });
        return response.status;
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function PostReview(review: WriteReviewModel, authToken: string): Promise<ReviewModel | null> {
    try {
        const response = await fetch(BASE_API_URL + `/api/reviews`, {
            method: "POST",
            body: JSON.stringify(review),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw Object.assign(new Error("review.post.failed"), {
            status: response.status,
        });

        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function GetExploreReviewPageData(queryParams: string): Promise<LikedReviews[]> {
    try {
        const response = await fetch(BASE_API_URL + `/api/reviews/explore${queryParams}`, {
            credentials: "include",
        });
        if (!response.ok) throw Object.assign(new Error("explore_review_data.load.failed"), {
            status: response.status,
        });

        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return [];
    }
}


export async function GetLatestReviewIds(): Promise<number[] | null> {
    try {
        let idsAmount = 100;
        const response = await fetch(BASE_API_URL + `/api/reviews/latest?amount=${idsAmount}`, {
            credentials: "include",
        });
        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        return null;
    }
}
