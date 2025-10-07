import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const user = storedUser?.user;
    const token = storedUser?.token;

    useEffect(() => {
        if (!user || !token) return;

        const fetchBookings = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(res.data.bookings);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };

        fetchBookings();
    }, []);

    // 🗑️ Delete booking
    const handleDelete = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        setLoading(true);

        try {
            await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(bookings.filter((b) => b._id !== bookingId));
        } catch (err) {
            console.error("Error deleting booking:", err);
            alert("Failed to delete booking.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <Typography>Please log in to see your bookings.</Typography>;

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
                My Bookings
            </Typography>

            {bookings.length === 0 ? (
                <Typography>No bookings found.</Typography>
            ) : (
                bookings.map((b) => (
                    <Paper
                        key={b._id}
                        elevation={2}
                        sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                        }}
                    >
                        <Typography><strong>Date:</strong> {new Date(b.date).toDateString()}</Typography>
                        <Typography><strong>Artist:</strong> {b.artist?.name}</Typography>
                        <Typography><strong>Status:</strong> {b.status || "Pending"}</Typography>

                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={() => handleDelete(b._id)}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : "cancel"}
                        </Button>
                    </Paper>
                ))
            )}
        </Box>
    );
}
