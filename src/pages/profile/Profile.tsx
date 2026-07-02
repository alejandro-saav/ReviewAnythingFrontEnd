import { useState, type ReactElement } from "react";
import type { UserInformation } from "../../types/AuthTypes";
import type { UserPageData } from "../../types/PagesTypes";
import { Link, redirect, useFetcher, useLoaderData, useRouteLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "react-router-dom";
import { FollowUser, GetUserPageData, UnFollowUser } from "../../services/UserService";
import SignInModal from "../../components/SignInModal";
import { GetAccessTokenFromRequest, isNullOrWhiteSpace } from "../../utils/helperFunctions";
import styles from "./Profile.module.css";
import type { loader as rootLoader } from "../../app/root";

export async function loader({ params }: LoaderFunctionArgs) {
    const { userId } = params;
    if (!userId || +userId == 0) return redirect("/not-found");
    const userPageData: UserPageData | null = await GetUserPageData(+userId);
    if (!userPageData) return redirect("/not-found");
    return { userPageData, userId }
}

export async function action({ request }: ActionFunctionArgs) {
    const authToken: string | null = GetAccessTokenFromRequest(request);
    if (!authToken) return { error: "No auth token found" };
    const data = await request.json();
    if (data.type == "followUser") {
        delete data.type;
        await FollowUser(data.targetUserId, authToken);
        return;
    } else if (data.type == "unfollowUser") {
        delete data.type;
        await UnFollowUser(data.targetUserId, authToken);
        return;
    }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const user = data?.userPageData!;

    const title = `${user.userSummary.firstName ?? user.userSummary.userName} (@${user.userSummary.userName}) | ReviewAnything`;
    const description = user.userSummary.bio
        ? `${user.userSummary.bio.slice(0, 120)}${user.userSummary.bio.length > 120 ? "..." : ""} — ${user.totalReviews} reviews on ReviewAnything.`
        : `${user.userSummary.userName} has written ${user.totalReviews} reviews on ReviewAnything. ${user.followers.length} followers · ${user.following.length} following.`;

    const canonical = `https://reviewanything.site/profile/${user.userSummary.userId}`;
    const ogImage = user.userSummary.profileImage ?? "https://reviewanything.site/review_anything_1200x630.png";

    return [
        { title },
        { name: "description", content: description },

        { tagName: "link", rel: "canonical", href: canonical },

        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: ogImage },
        { property: "profile:username", content: user.userSummary.userName },

        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },

        {
            "script:ld+json": {
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                "mainEntity": {
                    "@type": "Person",
                    "name": user.userSummary.firstName ?? user.userSummary.userName,
                    "alternateName": user.userSummary.userName,
                    "description": user.userSummary.bio ?? undefined,
                    "image": user.userSummary.profileImage ?? undefined,
                    "url": canonical,
                    "interactionStatistic": [
                        {
                            "@type": "InteractionCounter",
                            "interactionType": "https://schema.org/FollowAction",
                            "userInteractionCount": user.followers.length,
                        },
                        {
                            "@type": "InteractionCounter",
                            "interactionType": "https://schema.org/WriteAction",
                            "userInteractionCount": user.totalReviews,
                        },
                        {
                            "@type": "InteractionCounter",
                            "interactionType": "https://schema.org/CommentAction",
                            "userInteractionCount": user.totalComments,
                        },
                    ],
                },
            },
        },
    ];
};

export default function Profile(): ReactElement {
    const fetcher = useFetcher();
    const user: UserInformation | null | undefined = useRouteLoaderData<typeof rootLoader>("root")?.userInfo;
    const { userPageData, userId } = useLoaderData<typeof loader>();
    const [userData, setUserData] = useState<UserPageData | null>(userPageData);
    const [showModal, setShowModal] = useState<boolean>(false);

    async function HandleFollowUser(e: any) {
        e.stopPropagation();
        if (user == null) {
            setShowModal(true);
            return;
        }
        if (userData?.isCurrentUserFollowing) {
            fetcher.submit({ targetUserId: +userId, type: "unfollowUser" }, { method: "POST", encType: "application/json" });
            setUserData({ ...userData, isCurrentUserFollowing: false, followers: userData.followers.filter(users => users.userId != user.userId) })
        } else {
            if (userData == undefined) return;
            fetcher.submit({ targetUserId: +userId, type: "followUser" }, { method: "POST", encType: "application/json" });
            setUserData({ ...userData, isCurrentUserFollowing: true, followers: [...userData.followers, user] })
        }
    }
    return (
        <div onClick={(e) => {
            e.stopPropagation();
            setShowModal(false)
        }}>
            <h1 className={styles.titleHeader}>Profile </h1>
            <div className={styles.container}>
                <div className={styles.profileHeader}>
                    <img
                        src={userData?.userSummary?.profileImage ?? undefined}
                        alt="Profile Picture" className={styles.profileImage} id="profileImage" />

                    <div className={styles.profileInfo}>
                        <h1 className={styles.profileName} id="fullName">{`${userData?.userSummary.firstName} ${userData?.userSummary.lastName}`}</h1>
                        <div className={styles.username} id="username">{userData?.userSummary.userName}</div>
                        <p className={styles.bio} id="bio">{userData?.userSummary.bio}</p>

                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber} id="reviewCount">{userData?.totalReviews}</span>
                                <span className={styles.statLabel}>Reviews</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber} id="commentCount">{userData?.totalComments}</span>
                                <span className={styles.statLabel}>Comments</span>
                            </div>
                            <div onClick={HandleFollowUser}>
                                {user && user.userId != userData?.userSummary.userId &&
                                    <button className={styles.btn}>
                                        {userData?.isCurrentUserFollowing ?
                                            <span>Following</span>
                                            :
                                            <span>Follow</span>
                                        }
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div >

                <div className={styles.socialSections}>
                    <div className={styles.followersSection}>
                        <h3 className={styles.header}>Followers (<span id="followerCount">{userData?.followers.length}</span>)</h3>
                        {userData && userData.followers.length > 0 ?
                            userData?.followers.map((follower, index) =>
                                <div className={styles.followersGrid} id="followersGrid">
                                    <Link key={index} to={`/profile/${follower.userId}`} className={styles.followerItem}>
                                        <img src={follower.profileImage ?? undefined} alt="User Profile Picture" className={styles.followerAvatar} width="50"
                                            height="50" />
                                        <div className={styles.followerName}>{follower.userName}</div>
                                    </Link>
                                </div>
                            )
                            :
                            <p>No followers to show.</p>
                        }
                    </div>

                    <div className={styles.followingSection}>
                        <h3 className={styles.header}>Following (<span id="followingCount">{userData?.following.length}</span>)</h3>
                        {userData && userData?.following.length > 0 ?
                            userData.following.map((followee, index) =>
                                <div className={styles.followingGrid} id="followingGrid">
                                    <Link to={`/profile/${followee.userId}`} className={styles.followerItem} key={index} >
                                        {isNullOrWhiteSpace(followee.profileImage) ?
                                            <div className={styles.profilePhoto}>@{followee.userName?.substring(0, 2)}</div>
                                            :
                                            <>
                                                <img src={followee.profileImage ?? undefined} alt={followee.userName ?? ""} className={styles.followerAvatar} width="50"
                                                    height="50" />
                                                <div className={styles.followerName}>{followee.userName}</div>
                                            </>
                                        }
                                    </Link>
                                </div>
                            )

                            :
                            <p>No users following this user yet.</p>
                        }
                    </div>
                </div>
            </div>
            {showModal && <SignInModal />}
        </div>
    )
}