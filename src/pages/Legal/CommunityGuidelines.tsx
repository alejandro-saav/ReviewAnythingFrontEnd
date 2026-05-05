import type { ReactElement } from 'react';
import styles from "./CommunityGuidelines.module.css";
import type { MetaFunction } from 'react-router-dom';

export const meta: MetaFunction = () => {
    return [
        { title: "Community Guidelines | ReviewAnything" },
        {
            name: "description",
            content: "ReviewAnything community standards. Guidelines for honest, respectful, and safe content on our review platform."
        },
        { name: "robots", content: "index, follow" },
    ];
};

export default function CommunityGuidelines(): ReactElement {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>COMMUNITY GUIDELINES</h1>
            <p className={styles.text}><strong>ReviewAnything</strong></p>
            <p className={styles.text}>Effective Date: May 2, 2026</p>

            <section>
                <p className={styles.text}>
                    Welcome to ReviewAnything. These guidelines ensure our platform remains a respectful,
                    honest, and useful space for everyone. ReviewAnything allows users to review
                    anything, using categories like Books, Movies, and Technology as organizational tags.
                </p>
            </section>

            <h2 className={styles.heading}>1. Be Honest and Authentic</h2>
            <ul className={styles.list}>
                <li className={styles.listItem}>Reviews must reflect genuine, personal experiences.</li>
                <li className={styles.listItem}>No fake, paid, or reputation-manipulating reviews.</li>
                <li className={styles.listItem}>No impersonation of other individuals or public figures.</li>
            </ul>

            <h2 className={styles.heading}>2. Be Respectful</h2>
            <p className={styles.text}>
                Critique the subject of the review, not other users personally. Discriminatory
                language and targeted harassment are strictly prohibited.
            </p>

            <h2 className={styles.heading}>4. No Harmful or Illegal Content</h2>
            <p className={styles.text}>
                Prohibited content includes items inciting violence, sexualization of minors,
                defamation, doxxing, and phishing links.
            </p>

            <h2 className={styles.heading}>6. Protecting Minors</h2>
            <p className={styles.text}>
                The platform is open to all ages. Users must not post sexually explicit content
                or attempt to solicit minors.
            </p>

            <h2 className={styles.heading}>8. Enforcement</h2>
            <h3 className={styles.heading}>8.1 How We Handle Violations</h3>
            <ul className={styles.list}>
                <li className={styles.listItem}><strong>First violation:</strong> Warning and content removal.</li>
                <li className={styles.listItem}><strong>Repeated/Severe:</strong> Account suspension or permanent ban.</li>
            </ul>

            <h3 className={styles.heading}>8.2 Reporting Content</h3>
            <p className={styles.text}>
                Report violations by contacting oacastros333@gmail.com with the content URL and
                a description of the issue.
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