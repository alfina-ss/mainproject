import React from "react";

export default function ServiceCard({ title, price, description, image }) {
  const styles = {
    card: {
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
      cursor: "pointer",
    },
    image: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    content: {
      padding: "1rem",
      textAlign: "center",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#658304ff", // pink-700
      marginBottom: "0.5rem",
    },
    price: {
      color: "#658304ff", // darker pink
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    description: {
      color: "#4b5563", // gray-600
      fontSize: "1rem",
      lineHeight: "1.5rem",
    },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img src={image} alt={title} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.price}>₹{price}</p>
        <p style={styles.description}>{description}</p>
      </div>
    </div>
  );
}
