import styles from './ExploreCategories.module.css';

import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
    const title = "Explore Categories | ReviewAnything";
    const description = "Discover and review everything that matters to you. Browse reviews across Books, Movies, Music, Games, Technology, Art, and Science.";
    const canonical = "https://reviewanything.site/categories";

    return [
        { title },
        { name: "description", content: description },

        { tagName: "link", rel: "canonical", href: canonical },

        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: "https://reviewanything.site/review_anything_1200x630.png" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },

        {
            "script:ld+json": {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Explore Categories",
                "description": description,
                "url": canonical,
                "hasPart": [
                    { "@type": "Thing", "name": "Books", "url": "https://reviewanything.site/explore?Category=Books" },
                    { "@type": "Thing", "name": "Movies", "url": "https://reviewanything.site/explore?Category=Movies" },
                    { "@type": "Thing", "name": "Music", "url": "https://reviewanything.site/explore?Category=Music" },
                    { "@type": "Thing", "name": "Games", "url": "https://reviewanything.site/explore?Category=Games" },
                    { "@type": "Thing", "name": "Technology", "url": "https://reviewanything.site/explore?Category=Technology" },
                    { "@type": "Thing", "name": "Art", "url": "https://reviewanything.site/explore?Category=Art" },
                    { "@type": "Thing", "name": "Science", "url": "https://reviewanything.site/explore?Category=Science" },
                ],
            },
        },
    ];
};

export default function ExploreCategories() {
    return (
        <>
            <div className={styles.floatingShapes}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Categories</h1>
                    <p>Discover and review everything that matters to you. Choose a category to start exploring.</p>
                </div>

                <div className={styles.categoriesGrid} id="categoriesGrid">
                    <a className={styles.categoryCard} data-category="books" href="/explore?Category=Books">
                        <div className={styles.categoryIcon}>📚</div>
                        <h3>Books</h3>
                        <p>Novels, non-fiction, poetry, and everything literary. Share your thoughts on the latest reads.</p>
                    </a>

                    <a className={styles.categoryCard} data-category="movies" href="/explore?Category=Movies">
                        <div className={styles.categoryIcon}>🎬</div>
                        <h3>Movies</h3>
                        <p>From blockbusters to indie films. Review the latest releases and timeless classics.</p>
                    </a>

                    <a className={styles.categoryCard} data-category="music" href="/explore?category=Music">
                        <div className={styles.categoryIcon}>🎵</div>
                        <h3>Music</h3>
                        <p>Albums, singles, concerts, and artists. Share your musical discoveries and favorites.</p>
                    </a>

                    <a className={styles.categoryCard} data-category="games" href="/explore?Category=Games">
                        <div className={styles.categoryIcon}>🎮</div>
                        <h3>Games</h3>
                        <p>Video games, board games, mobile games. Rate and review your gaming experiences.</p>
                    </a>

                    <a className={styles.categoryCard} data-category="technology" href="/explore?Category=Technology">
                        <div className={styles.categoryIcon}>⚡</div>
                        <h3>Technology</h3>
                        <p>Gadgets, apps, software, and tech innovations. Help others make informed decisions.</p>
                    </a>

                    <a className={styles.categoryCard} data-category="art" href="/explore?Category=Art">
                        <div className={styles.categoryIcon}>🎨</div>
                        <h3>Art</h3>
                        <p>Paintings, sculptures, digital art, and exhibitions. Express your artistic perspectives.</p>
                    </a>

                    <a className={styles.categoryCard} data-category="science" href="/explore?Category=Science">
                        <div className={styles.categoryIcon}>🔬</div>
                        <h3>Science</h3>
                        <p>Research papers, documentaries, and scientific discoveries. Dive into the world of knowledge.</p>
                    </a>
                </div>
            </div>
        </>
    );
}