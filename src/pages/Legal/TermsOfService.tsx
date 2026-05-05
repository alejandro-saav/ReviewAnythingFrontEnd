import { type ReactElement } from 'react';
import styles from "./TermsOfService.module.css"
import type { MetaFunction } from 'react-router-dom';


export const meta: MetaFunction = () => {
    return [
        { title: "Terms of Service | ReviewAnything" },
        {
            name: "description",
            content: "Read the Terms of Service for ReviewAnything, governed by the laws of the Republic of Colombia."
        },
        { name: "robots", content: "noindex, follow" },
    ];
};

export default function TermsOfService(): ReactElement {

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>TERMS OF SERVICE</h1>
            <p className={styles.text}><strong>ReviewAnything</strong></p>
            <p className={styles.text}>Effective Date: May 2, 2026</p>

            <h2 className={styles.heading}>1. Acceptance of Terms</h2>
            <p className={styles.text}>
                By accessing or using ReviewAnything ("the Platform", "we", "us", or "our"), available at https://reviewanything.site, you agree to be bound by these Terms of Service ("Terms").
                These Terms constitute a legally binding agreement between you and ReviewAnything, operated from the Republic of Colombia and governed by Colombian law.
            </p>

            <h2 className={styles.heading}>2. Description of the Platform</h2>
            <p className={styles.text}>
                ReviewAnything is a community-driven platform that allows users to publish, discover, and interact with reviews on a wide range of topics.
                The Platform is provided free of charge and is not monetized.
            </p>

            <h2 className={styles.heading}>3. Eligibility</h2>
            <p className={styles.text}>
                Users under the age of 18 must have the consent of a parent or legal guardian to create an account.
                We reserve the right to terminate accounts of users who misrepresent their age or consent status.
            </p>

            <h2 className={styles.heading}>4. Account Registration</h2>
            <ul className={styles.list}>
                <li className={styles.listItem}>Provide accurate, complete, and current information.</li>
                <li className={styles.listItem}>Keep your password confidential.</li>
                <li className={styles.listItem}>Notify us immediately of unauthorized account use.</li>
                <li className={styles.listItem}>Sole responsibility for all activity under your account.</li>
            </ul>

            <h2 className={styles.heading}>5. User Content</h2>
            <h3 className={styles.heading}>5.1 Your Content</h3>
            <p className={styles.text}>
                You retain ownership of any reviews or comments submitted.
                You grant ReviewAnything a non-exclusive, worldwide, royalty-free license to display and distribute your content for operating the Platform.
            </p>

            <h3 className={styles.heading}>5.2 Content Standards</h3>
            <p className={styles.text}>Content must not be false, misleading, defamatory, or infringe on third-party intellectual property rights.</p>

            <h2 className={styles.heading}>6. Intellectual Property</h2>
            <p className={styles.text}>
                All content, design, and software not belonging to users is the property of ReviewAnything.
            </p>

            <h2 className={styles.heading}>9. Account Deletion and Data Removal</h2>
            <p className={styles.text}>
                Personal account data will be permanently removed within 30 days of account deletion.
                Published reviews may be anonymized and retained to preserve community discussions.
            </p>

            <h2 className={styles.heading}>10. Disclaimers</h2>
            <p className={styles.text}>
                The Platform is provided on an "AS IS" and "AS AVAILABLE" basis.
                ReviewAnything does not endorse or verify any User Content.
            </p>

            <h2 className={styles.heading}>15. Governing Law and Jurisdiction</h2>
            <p className={styles.text}>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of Colombia.
            </p>

            <h2 className={styles.heading}>16. Contact Information</h2>
            <p className={styles.text}>
                ReviewAnything<br />
                Email: oacastros333@gmail.com<br />
                Website: https://reviewanything.site<br />
                Country: Republic of Colombia
            </p>
            <p className={styles.text}>Last updated: May 2, 2026</p>
        </div>
    );
};
