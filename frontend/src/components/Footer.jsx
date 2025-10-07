import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const styles = {
        footer: {
            backgroundColor: "#ddb3b3",
            padding: "2rem 1rem",
            textAlign: "center",
            marginTop: "2rem",
            // borderTop: "2px solid #8cbe18",
        },
        links: {
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            marginBottom: "1rem",
        },
        link: {
            textDecoration: "none",
            color: "black",
            fontWeight: "500",
            transition: "color 0.2s",
        },
        linkHover: {
            color: "#8cbe18",
        },
        copyright: {
            color: "#374151",
            fontSize: "0.9rem",
        },
    };

    const [hovered, setHovered] = React.useState(null);

    return (
        <footer style={styles.footer}>
            <div style={styles.links}>
                {["Home", "About", "Services", "Contact"].map((text, i) => {
                    const path = text === "Home" ? "/" : `/${text.toLowerCase()}`;
                    return (
                        <Link
                            key={i}
                            to={path}
                            style={{
                                ...styles.link,
                                ...(hovered === i ? styles.linkHover : {}),
                            }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {text}
                        </Link>
                    );
                })}
            </div>
            <p style={styles.copyright}>
                © {new Date().getFullYear()} Glamora. All rights reserved.
            </p>
        </footer>
    );
}
