import { type ReactElement } from "react";
import styles from './NotFound.module.css';
import { Link, type MetaFunction } from "react-router-dom";

export const meta: MetaFunction = () => {
    return [
        { title: "Page Not Found | ReviewAnything" },
        { name: "description", content: "The page you are looking for does not exist or has been removed." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/not-found" },
    ];
};

export default function NotFound(): ReactElement {
    return (
        <div className={styles.container}>
            <div className={styles.errorCode}>404</div>
            <h1 className={styles.errorTitle}>Page Not Found</h1>

            <div className={styles.decorativeElements}>
                <div className={styles.icon}></div>
                <div className={styles.icon}></div>
                <div className={styles.icon}></div>
            </div>

            <div className={styles.divider}></div>

            <p className={styles.errorMessage}>
                The page you're looking for doesn't exist or has been moved.
                Please check the URL or return to the homepage.
            </p>

            <Link to="/" className={styles.homeButton}>
                <div>←</div> <div>Back to Home</div>
            </Link>
        </div>
    )
}