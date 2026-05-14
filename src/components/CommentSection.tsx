import { useState, type Dispatch, type ReactElement, type SetStateAction } from "react";
import type { Comment, CommentVoteRequest, CommentVoteResponse, ReviewPageData } from "../types/ReviewTypes";
import type { UserInformation } from "../types/AuthTypes";
import { formatDate, isNullOrWhiteSpace } from "../utils/helperFunctions";
import LoadingSpinner from "./loadingComponents/LoadingSpinner";
import styles from "./CommentSection.module.css"
import { Link, useRouteLoaderData, type FetcherWithComponents } from "react-router-dom";
import { PostCommentVote } from "../services/ReviewService";
import { useForm, type SubmitHandler } from "react-hook-form";
import LikeDislikeBtn from "./LikeDislikeBtn";
import type { loader as rootLoader } from "../app/root";

interface CommentSectionProps {
    comments: Comment[];
    usersFollowingIds: number[];
    userCommentVotes: CommentVoteResponse[];
    HandleUserFollow: (targetUserId: number) => Promise<void>;
    HandleModal: (showModal: boolean) => void;
    HandleReviewPageData: Dispatch<SetStateAction<ReviewPageData>>;
    reviewId: number;
    fetcher: FetcherWithComponents<any>;
}

interface CommentForm {
    comment: string;
}

export default function CommentSection({ comments, usersFollowingIds, userCommentVotes, HandleUserFollow, HandleModal, reviewId, HandleReviewPageData, fetcher }: CommentSectionProps): ReactElement {
    const user: UserInformation | null | undefined = useRouteLoaderData<typeof rootLoader>("root")?.userInfo;


    const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<CommentForm>({ mode: "onChange" });

    const [disableVoteBtn, setDisableVoteBtn] = useState<boolean>(false);

    const onSubmitComment: SubmitHandler<CommentForm> = async (data) => {
        fetcher.submit({ ...data, type: "submitComment", reviewId: reviewId }, { method: "POST", encType: "application/json" });
    }

    function UserHasVotedComment(commentId: number, voteType: number) {
        return userCommentVotes.some((commentVote: CommentVoteResponse) => commentVote.commentId == commentId && commentVote.userVote == voteType);
    }

    async function SubmitCommentVote(voteType: number, commentId: number): Promise<void> {
        if (user == null) {
            HandleModal(true);
            return;
        };
        // disable btn until function executes
        setDisableVoteBtn(true);

        const commentVoteRequest: CommentVoteRequest = {
            commentId: commentId,
            reviewId: reviewId,
            voteType: voteType,
        };

        const submitVoteResponse = await PostCommentVote(commentVoteRequest);
        // Check if post vote was a success
        if (submitVoteResponse) {
            // check if there is a vote in the fetch data from the review component
            if (userCommentVotes.some((vote, _) => vote.commentId == commentId)) {
                // There is an existing vote
                // Check if vote is equal to current vote if so i delete the vote else i update the vote
                let userCommentVotesUpdate: CommentVoteResponse[];

                //update comment likes count
                // get current likes count
                let commentLikes: number = comments.find(comment => commentId == comment.commentId)?.likes!;
                // get current user vote
                let currentUserVote: number = userCommentVotes.find(comment => commentId == comment.commentId)?.userVote!;

                if (voteType == 1 && currentUserVote != 1) ++commentLikes;
                if (voteType == -1 && currentUserVote == 1 || voteType == 1 && currentUserVote == 1) --commentLikes;

                // check if vote type == to current user vote meaning the user is clicking a vote type that is already active so extract vote from array else update vote from the array
                if (userCommentVotes.some((vote, _) => vote.commentId == commentId && vote.userVote == voteType)) {
                    userCommentVotesUpdate = userCommentVotes.filter(vote => vote.commentId != commentId);
                } else {
                    userCommentVotesUpdate = userCommentVotes.map((vote) => vote.commentId == commentId ? { ...vote, userVote: voteType } : vote);
                }
                HandleReviewPageData((prev: ReviewPageData) => {
                    return { ...prev, commentVotes: userCommentVotesUpdate, comments: prev.comments.map(comment => comment.commentId == commentId ? { ...comment, likes: commentLikes } : comment) }
                });
            } else {
                // if not i insert a new voteType object
                HandleReviewPageData((prev: ReviewPageData) => {
                    return { ...prev, commentVotes: [...userCommentVotes, { commentId: commentId, userVote: voteType }], comments: comments.map(comment => comment.commentId == commentId ? { ...comment, likes: voteType == 1 ? ++comment.likes : comment.likes } : comment) }
                });
            }
        } else {
            // Something went wrong with the post request.
            console.log("FAILED!");
        };

        // activate btn again
        setDisableVoteBtn(false);
    };
    return (
        <div className={styles.commentsSection}>
            <div className={styles.commentsTitle}> Comments {comments.length}</div>
            <form onSubmit={handleSubmit(onSubmitComment)}>
                <div className={styles.leaveCommentContainer}>
                    {isNullOrWhiteSpace(user?.profileImage) ?
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                fill="none"
                                className={styles.profileSvg}>
                                <circle cx="12" cy="12" r="11" stroke="#FE5D26" strokeWidth="2" fill="none" />
                                <path
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                    fill="#FE5D26" />
                            </svg>
                        </div>
                        :
                        <img id="previewImg" src={user?.profileImage ?? undefined} alt="Profile Image" className={styles.profileImage} />
                    }
                    <textarea {...register("comment", {
                        required: true,
                        minLength: 1,
                        validate: {
                            notEmpty: (value) => value.trim().length > 0 || "comment cannot be empty spaces",
                            noHtml: (value) => !/<[a-z][\s\S]*>/i.test(value) || "HTML tags are not allowed"
                        }
                    })} id="leave-comment-input" className={styles.leaveCommentInput}
                        placeholder="Leave a comment..." name="comment" onClick={(e) => {
                            e.stopPropagation();
                            user == null && HandleModal(true);
                        }} readOnly={user == null ? true : false}></textarea>


                    <button className={styles.btn} type="submit"
                        disabled={!isValid || isSubmitting}>
                        {isSubmitting ?
                            <LoadingSpinner />
                            :
                            <span>Comment</span>
                        }
                    </button>
                </div>
            </form >
            {errors.root && <span className={styles.errorMessage}>{errors.root.message}</span>}
            {comments.map((comment: Comment, index: number) => (
                <div className={styles.comment} key={index}>
                    <div className={styles.commentHeader}>
                        {isNullOrWhiteSpace(comment.userInformation?.profileImage) ?
                            <div className={styles.profilePhoto}>UD</div>
                            :
                            <Link to={`/profile/${comment.userInformation?.userId}`}>
                                <img src={comment.userInformation?.profileImage ?? undefined} alt="profile-picture"
                                    className={styles.profilePictureImage} />
                            </Link>
                        }
                        <div className={styles.userInfo}>
                            {comment.userInformation.userId == 0 ?
                                <div className={styles.userCommentDeleted}>
                                    User Deleted
                                </div>
                                :
                                <Link className={styles.usernameComment}
                                    to={`/profile/${comment.userInformation.userId}`}>{comment.userInformation.userName}</Link>
                            }
                            <div className={styles.userStats}>
                                <span>{comment.userInformation.reviewCount} reviews</span>
                                <span>•</span>
                                <span>{comment.userInformation.followerCount} followers</span>
                            </div>
                        </div>
                        <div onClick={(e) => {
                            e.stopPropagation();
                            HandleUserFollow(comment.userInformation.userId);
                        }}
                        >
                            {user?.userId != comment.userInformation.userId && comment.userInformation.userName &&
                                <button className={styles.btn}>
                                    {user && usersFollowingIds.includes(user.userId) ?
                                        <span>Following</span>
                                        :
                                        <span>Follow</span>
                                    }
                                </button>
                            }
                        </div>
                    </div>
                    <div className={styles.commentContent}>
                        {comment.content}
                    </div>
                    <div className={styles.commentFooter}>
                        <div className={styles.commentMeta}>
                            <span>Edited: {formatDate(comment.lastEditDate)}</span>
                        </div>
                        <div className={styles.commentActions}>
                            <LikeDislikeBtn disable={disableVoteBtn} btnType="like" isActive={UserHasVotedComment(comment.commentId, 1)} SubmitCommentVote={SubmitCommentVote} context="comment" commentId={comment.commentId} likeCount={comment.likes} />
                            <LikeDislikeBtn disable={disableVoteBtn} btnType="dislike" isActive={UserHasVotedComment(comment.commentId, -1)} SubmitCommentVote={SubmitCommentVote} context="comment" commentId={comment.commentId} />
                        </div >
                    </div >
                </div >
            ))}
        </div >
    )
}