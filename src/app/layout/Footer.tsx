import type { ReactElement } from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer(): ReactElement {
    const year = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerSection}>
                    <h3>ReviewAnything</h3>
                    <p>The ultimate platform for honest reviews about everything. Join our community of authentic voices.</p>
                </div>
                <div className={styles.footerSection}>
                    <h3>Explore</h3>
                    <ul>
                        <li><Link to="/explore">Recent Reviews</Link></li>
                        <li><Link to="/categories">Categories</Link></li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h3>Community</h3>
                    <ul>
                        <li><Link to="/community-guidelines">Guidelines</Link></li>
                        <li><Link to="/terms-of-service">Terms of Service</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/DMCAPolicy">DMCAPolicy</Link></li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h3>Account</h3>
                    <ul>
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Log In</Link></li>
                        <li><Link to="/write-review">Write Review</Link></li>
                        <li><Link to="/my-profile">My Profile</Link></li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; {year} ReviewAnything. All rights reserved.</p>
            </div>
        </footer>
    )
}