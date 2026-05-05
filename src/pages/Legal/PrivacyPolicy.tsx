import type { ReactElement } from 'react';
import styles from "./PrivacyPolicy.module.css";
import type { MetaFunction } from 'react-router-dom';


export const meta: MetaFunction = () => {
    return [
        { title: "Privacy Policy | ReviewAnything" },
        {
            name: "description",
            content: "ReviewAnything Privacy Policy. Learn how we handle personal data in compliance with Colombian Law 1581 of 2012 and GDPR."
        },
        { name: "robots", content: "noindex, follow" },
    ];
};

export default function PrivacyPolicy(): ReactElement {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>PRIVACY POLICY</h1>
            <p className={styles.text}><strong>ReviewAnything</strong></p>
            <p className={styles.text}>Effective Date: May 2, 2026</p>

            <section>
                <p className={styles.text}>
                    ReviewAnything is committed to protecting your personal data. This policy applies to all users
                    at https://reviewanything.site and is governed by Colombian Law 1581 of 2012 and the GDPR where relevant.
                </p>
            </section>

            <h2 className={styles.heading}>1. Data Controller</h2>
            <p className={styles.text}>
                Platform: ReviewAnything<br />
                Country: Republic of Colombia<br />
                Contact Email: oacastros333@gmail.com
            </p>

            <h2 className={styles.heading}>2. Data We Collect</h2>
            <h3 className={styles.heading}>2.1 Data You Provide Directly</h3>
            <ul className={styles.list}>
                <li className={styles.listItem}>Username and Email address.</li>
                <li className={styles.listItem}>Profile photo (optional).</li>
                <li className={styles.listItem}>Reviews, comments, and ratings.</li>
            </ul>

            <h3 className={styles.heading}>2.2 Data Collected Automatically</h3>
            <ul className={styles.list}>
                <li className={styles.listItem}>Raw IP address.</li>
                <li className={styles.listItem}>Essential session cookies for authentication.</li>
                <li className={styles.listItem}>Anonymous visit cookies (30-minute expiration).</li>
            </ul>

            <h2 className={styles.heading}>3. How We Use Your Data</h2>
            <p className={styles.text}>
                Data is used to manage accounts, display reviews, prevent fraud, and comply with Colombian legal obligations.
            </p>

            <h2 className={styles.heading}>4. Cookies</h2>
            <p className={styles.text}>
                We use only session cookies and a 30-minute visit cookie. We do not use analytics or advertising cookies.
            </p>

            <h2 className={styles.heading}>7. Data Retention</h2>
            <p className={styles.text}>
                Account data is deleted within 30 days of account deletion. Server logs are retained for a maximum of 12 months.
            </p>

            <h2 className={styles.heading}>9. Your Rights</h2>
            <p className={styles.text}>
                Under Ley 1581 de 2012, you have the right to know, update, and rectify your data, or revoke consent via oacastros333@gmail.com.
            </p>

            <h2 className={styles.heading}>10. Data Security</h2>
            <p className={styles.text}>
                We use HTTPS/TLS encryption and hashed/salted password storage to protect your information.
            </p>

            <p className={styles.text}>Last updated: May 2, 2026</p>
        </div>
    );
}