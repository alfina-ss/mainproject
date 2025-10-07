import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Button,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    Divider,
    Rating,
} from "@mui/material";

export default function ArtistProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { artist } = location.state || {};

    if (!artist) {
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <Typography variant="h6" color="text.secondary">
                    No artist data found
                </Typography>
            </Box>
        );
    }

    const portfolio = Array.isArray(artist.portfolio)
        ? artist.portfolio
        : [
            { image: "/engagement.jpg", title: "Bridal Look" },
            { image: "/party.jpg", title: "Party Glam" },
            { image: "/logbride.jpg", title: "Casual Makeup" },
        ];

    const reviews = Array.isArray(artist.reviews)
        ? artist.reviews
        : [
            { name: "Aisha", review: "Loved the bridal look, highly recommend!", rating: 5 },
            { name: "Meera", review: "Very professional and friendly.", rating: 4 },
            { name: "Riya", review: "Amazing work, punctual and talented!", rating: 5 },
        ];

    const isAvailable = true;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #fafafa 0%, #fff 100%)",
                py: 6,
            }}
        >
            <Box
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    px: 3,
                    bgcolor: "white",
                    borderRadius: 4,
                    boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
                    p: 4,
                }}
            >
                {/* Top Section */}
                <Grid container spacing={4} alignItems="center">
                    {/* Left Image */}
                    <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                        <Box
                            sx={{
                                width: 250,
                                height: 250,
                                borderRadius: "50%",
                                overflow: "hidden",
                                mx: "auto",
                                boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
                            }}
                        >
                            <img
                                src={artist.image || "/default-profile.jpg"}
                                alt={artist.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                    </Grid>

                    {/* Right Info */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "#4e6c50" }}>
                            {artist.name}
                        </Typography>

                        <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.6 }}>
                            {artist.bio ||
                                "I am a professional makeup artist with expertise in bridal, party, and casual makeup. I focus on enhancing natural beauty using high-quality techniques and products."}
                        </Typography>

                        <Typography sx={{ mt: 2 }}>📍 {artist.city || "City not specified"}</Typography>
                        <Typography sx={{ mt: 1, fontWeight: "bold", color: "#37474f" }}>
                            {artist.price || "N/A"}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                fontWeight: "bold",
                                color: isAvailable ? "green" : "red",
                            }}
                        >
                            {isAvailable ? "✅ Available for Booking" : "❌ Currently Unavailable"}
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Typography>✨ Experience: 5+ years</Typography>
                            <Typography>⭐ Rating: 4.8/5 (120 reviews)</Typography>
                            <Typography>📅 Completed Bookings: 350+</Typography>
                        </Box>

                        {/* Services */}
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ fontWeight: 600, mb: 1 }}>Services:</Typography>
                            {Array.isArray(artist.services) && artist.services.length > 0 ? (
                                artist.services.map((service, i) => (
                                    <Typography key={i} sx={{ color: "text.secondary" }}>
                                        ✔{" "}
                                        {typeof service === "string"
                                            ? service
                                            : `${service.name || "Service"} ${service.price ? `- ₹${service.price}` : ""
                                            }`}
                                    </Typography>
                                ))
                            ) : (
                                <Typography color="text.secondary">No services listed</Typography>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            sx={{
                                mt: 4,
                                px: 5,
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: "bold",
                                background: "linear-gradient(90deg, #6a994e, #a7c957)",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #58803e, #8ab843)",
                                },
                            }}
                            onClick={() => navigate(`/booking/${artist._id}`, { state: { artist } })}
                            disabled={!isAvailable}
                        >
                            Book Now
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Portfolio */}
            <Box sx={{ maxWidth: 1100, mx: "auto", mt: 6, px: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 2, fontWeight: 700, color: "#4e6c50", textAlign: "center" }}
                >
                    Portfolio
                </Typography>
                <Grid container spacing={3}>
                    {portfolio.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    overflow: "hidden",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.04)",
                                        boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={item.image}
                                    alt={item.title}
                                />
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {item.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Reviews */}
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, px: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 2, fontWeight: 700, color: "#4e6c50", textAlign: "center" }}
                >
                    Reviews
                </Typography>
                {reviews.map((rev, i) => (
                    <Card
                        key={i}
                        sx={{
                            mb: 2.5,
                            p: 2.5,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 3,
                            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        <Avatar
                            sx={{
                                mr: 2,
                                bgcolor: "#a7c957",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {rev.name?.[0] || "A"}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {rev.name || "Anonymous"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {rev.review}
                            </Typography>
                            <Rating value={rev.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* Contact Info */}
            <Box
                sx={{
                    mt: 6,
                    textAlign: "center",
                    py: 4,
                    backgroundColor: "#f9f9f9",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#4e6c50" }}>
                    Contact Information
                </Typography>
                <Typography sx={{ mt: 1 }}>📞 {artist.phone || "+91 9876543210"}</Typography>
                <Typography>📧 {artist.email || "artist@example.com"}</Typography>
                <Typography sx={{ mt: 0.5 }}>
                    📱 Instagram: @{`glam_by_${(artist.name || "artist").toLowerCase()}`}
                </Typography>
            </Box>

            {/* Go Back */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                    variant="outlined"
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        borderColor: "#6a994e",
                        color: "#6a994e",
                        fontWeight: 600,
                        "&:hover": {
                            backgroundColor: "#eff6ef",
                            borderColor: "#58803e",
                        },
                    }}
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
            </Box>
        </Box>
    );
}
