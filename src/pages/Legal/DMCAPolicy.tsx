import type { ReactElement } from 'react';
import styles from "./DMCAPolicy.module.css";
import type { MetaFunction } from 'react-router-dom';

export const meta: MetaFunction = () => {
    return [
        { title: "DMCA & Copyright Policy | ReviewAnything" },
        {
            name: "description",
            content: "ReviewAnything copyright policy. Learn how to submit takedown notices or counter-notices under DMCA and Colombian Law 23 of 1982."
        },
        { name: "robots", content: "noindex, follow" },
    ];
};

export default function DMCAPolicy(): ReactElement {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>DMCA & COPYRIGHT POLICY</h1>
            <p className={styles.text}><strong>ReviewAnything</strong></p>
            <p className={styles.text}>Effective Date: May 2, 2026</p>

            <section>
                <h2 className={styles.heading}>1. Overview</h2>
                <p className={styles.text}>
                    ReviewAnything respects intellectual property rights. We follow procedures aligned with
                    the US Digital Millennium Copyright Act (DMCA) and Colombian Law 23 of 1982.
                </p>
            </section>

            <h2 className={styles.heading}>2. Reporting Copyright Infringement</h2>
            <p className={styles.text}>
                To submit a valid takedown notice, you must include your contact information, a description
                of the copyrighted work, the specific URL on ReviewAnything, and a statement under penalty
                of perjury.
            </p>
            <p className={styles.text}>
                Email: <strong>oacastros333@gmail.com</strong>
            </p>

            <h2 className={styles.heading}>4. Counter-Notice</h2>
            <p className={styles.text}>
                If your content was removed by mistake, you may submit a counter-notice identifying
                the material and stating your good faith belief that it was misidentified.
            </p>

            <h2 className={styles.heading}>5. Repeat Infringer Policy</h2>
            <p className={styles.text}>
                Users subject to multiple valid copyright takedown notices will have their accounts
                suspended or permanently terminated.
            </p>

            <h2 className={styles.heading}>7. Colombian Copyright Law</h2>
            <p className={styles.text}>
                We comply with Colombian Law 23 of 1982 and Decision 351 of the Andean Community.
                Colombian rights holders may submit claims using the same process.
            </p>

            <h2 className={styles.heading}>10. Contact</h2>
            <p className={styles.text}>
                Email: oacastros333@gmail.com<br />
                Website: https://reviewanything.site
            </p>
            <p className={styles.text}>Last updated: May 2, 2026</p>
        </div>
    );
}