import { useEffect, useState, type ReactElement } from "react";
import type { UserComments } from "../../types/ReviewTypes";
import styles from "./MyComments.module.css"
import { GetUserComments } from "../../services/UserService";
import { Link, type MetaFunction } from "react-router-dom";
import { formatDate } from "../../utils/helperFunctions";


export const meta: MetaFunction = () => {
    return [
        { title: "My Comments | ReviewAnything" },
        { name: "description", content: "View and manage all the comments you have written on ReviewAnything." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/my-comments" },
    ];
};

export default function MyComments(): ReactElement {
    const [comments, setComments] = useState<UserComments[]>([]);

    useEffect(() => {
        async function fetchComments() {
            const commentsResponse = await GetUserComments();
            if (commentsResponse != null) {
                setComments(commentsResponse);
            }
        }
        fetchComments();
    }, [])
    return (
        <div className={styles.mycommentsContainer}>
            <div className={styles.mycommentsWrapper}>
                <div className={styles.header}>
                    <h1>💬 My Comments</h1>
                    <p>All your comments across the platform</p>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>{comments.length}</div>
                            <div className={styles.statLabel}>Total Comments</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>{comments.reduce((accumulator, next) => accumulator + next.likes, 0)}</div>
                            <div className={styles.statLabel}>Total Likes</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>0</div>
                            <div className={styles.statLabel}>Total Replies</div>
                        </div>
                    </div>
                </div>

                <div className={styles.commentsGrid}>
                    {comments.length > 0 ? comments.map((comment, index) =>
                        <Link className={styles.commentCard} to={`/review/${comment.reviewId}`} key={index}>
                            <div className={styles.commentType}>Comment</div>
                            <div className={styles.reviewContext}>
                                <div className={styles.reviewTitle}>{comment.reviewTitle}</div>
                                <div className={styles.reviewAuthor}>
                                    <div className={styles.authorIcon}>S</div>
                                    <span>Review by {comment.userName}</span>
                                </div>
                            </div>
                            <div className={styles.commentContent}>
                                <div className={styles.commentText}>{(comment.content.length > 80
                                    ? comment.content.substring(0, 80) + "..."
                                    : comment.content)}</div>
                            </div>
                            <div className={styles.commentMeta}>
                                <div className={styles.editDate}>
                                    <span>📅</span>
                                    <span>Last edited: {formatDate(comment.lastEditDate)}</span>
                                </div>
                            </div>
                            <div className={styles.commentActions}>
                                <div className={styles.actionItem}>
                                    <span className={styles.heartIcon}>♥</span>
                                    <span className={styles.likesCount}>{comment.likes} likes</span>
                                </div>
                            </div>
                        </Link>
                    )
                        : <div className={styles.errorMessage}>Something went wrong while loading your comments, please try reloading the page.</div>}
                </div>
            </div>
        </div>
    )
}