import React from "react";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const services = [
    {
      title: "Bridal Makeup",
      price: 5000,
      description: "Get the perfect bridal look for your big day.",
      image: "/musbride.jpg",
    },
    {
      title: "Party Makeup",
      price: 2000,
      description: "Shine at parties with a glamorous makeover.",
      image: "/party.jpg",
    },
    {
      title: "Engagement Look",
      price: 3000,
      description: "A soft and elegant look for your engagement.",
      image: "/engagement.jpg",
    },
    {
      title: "Photoshoot Makeup",
      price: 2500,
      description: "Camera-ready makeup for your special photoshoots.",
      image: "/photoshoot.png",
    },
  ];

  const styles = {
    container: {
      padding: "2rem",
    },
    heading: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      textAlign: "center",
      color: "#658304ff", // pink-700
      marginBottom: "1.5rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Our Services</h2>
      <div style={styles.grid}>
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
}
