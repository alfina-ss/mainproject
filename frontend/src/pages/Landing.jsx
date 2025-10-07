import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Landing() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/artists");
        setArtists(res.data);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };
    fetchArtists();
  }, []);

  const styles = {
    container: { minHeight: "100vh", padding: "2rem", backgroundColor: "#f6f8f6ff", color: "#4f4747e1", fontFamily: "aries" },
    header: { textAlign: "center", marginBottom: "3rem" },
    heading: { fontSize: "3rem", fontWeight: "bold", marginBottom: "0.5rem" },
    subheading: { fontSize: "1.25rem", marginBottom: "1.5rem" },
    card: { backgroundColor: "#ffffffcc", borderRadius: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", overflow: "hidden", margin: "0 10px" },
    cardImage: { width: "100%", height: "250px", objectFit: "cover" },
    cardBody: { padding: "1rem" },
    name: { fontWeight: "bold", color: "#4f4747e1", fontSize: "1.2rem" },
    city: { color: "#374151", fontSize: "0.9rem", marginBottom: "0.5rem" },
    price: { fontWeight: "bold", color: "#4f4747e1", marginBottom: "0.5rem" },
    services: { fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem" },
    profileBtn: { padding: "0.4rem 0.8rem", backgroundColor: "#ddb3b3", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontWeight: "bold" },
    previewSection: { textAlign: "center", marginTop: "3rem", padding: "2rem", backgroundColor: "#ffffffcc", borderRadius: "0.5rem", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
    previewHeading: { fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", color: "#4f4747e1" },
    previewText: { fontSize: "1rem", color: "#374151", marginBottom: "1rem" },
    artistSignupBtn: { padding: "0.6rem 1rem", backgroundColor: "#ddb3b3", color: "white", border: "none", borderRadius: "0.3rem", cursor: "pointer", fontWeight: "bold", marginTop: "2rem" },
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <header style={styles.header}>
        <h1 style={styles.heading}>Welcome to Glamora</h1>
        <p style={styles.subheading}>
          Glamora is your ultimate destination for professional bridal and party makeup services.
          We connect you with top makeup artists across India, offering personalized beauty
          solutions, airbrush services, and complete bridal makeovers.
          Explore artist profiles, compare packages, and find the perfect look for your special day!
        </p>
      </header>

      {/* Artist Cards Slider */}
      <Slider {...settings}>
        {Array.isArray(artists) && artists.length > 0 ? (
          artists.map((artist, index) => (
            <div key={artist._id || index}>
              <div style={styles.card}>
                <img
                  src={artist.image || "/pages/default-hindbride.jpg"}
                  alt={artist.name || "Artist"}
                  style={styles.cardImage}
                />
                <div style={styles.cardBody}>
                  <h3 style={styles.name}>{artist.name || "Unknown Artist"}</h3>
                  {/* <p style={styles.city}>{artist.city || "City not specified"}</p>
                  <p style={styles.price}>{artist.price || "Price not specified"}</p> */}

                  {/* {Array.isArray(artist.services) && artist.services.length > 0 ? (
                    artist.services.map((service, i) => (
                      <p key={i} style={styles.services}>
                        ✔ {typeof service === "string" ? service : service.name || "Service"}
                      </p>
                    ))
                  ) : (
                    <p style={styles.services}>No services listed</p>
                  )} */}

                  <button
                    style={styles.profileBtn}
                    onClick={() => navigate(`/artist/${artist._id}`, { state: { artist } })}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>No artists available</p>
        )}
      </Slider>

      {/* Home Preview Section */}
      <section style={styles.previewSection}>
        <h2 style={styles.previewHeading}>Why Choose Glamora?</h2>
        <p style={styles.previewText}>
          At Glamora, we make it easy to find and book trusted makeup artists.
          Whether you’re looking for a simple party look or a glamorous bridal makeover,
          our curated list of professionals ensures quality service and flawless results.
        </p>
      </section>

      <section style={styles.previewSection}>
        <h2 style={styles.previewHeading}>Why hiring a professional bridal makeup artist is so important for weddings?</h2>
        <p style={styles.previewText}>
          We might not realize it at an earlier stage but looking beautiful is something that every
          bride dreams of. As weddings are once-in-a-lifetime experiences, professional makeup
          artists ensure flawless and lasting results, transforming a bride into her perfect self.
        </p>
      </section>

      {/* Artist Signup Button */}
      <div style={{ textAlign: "center" }}>
        <button
          style={styles.artistSignupBtn}
          onClick={() => navigate("/artist-signup")}
        >
          Sign Up as an Artist
        </button>
      </div>
    </div>
  );
}
