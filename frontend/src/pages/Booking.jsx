import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export default function Booking() {
  const { artistId } = useParams();
  const [date, setDate] = useState("");

  const navigate = useNavigate();
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"))?.user;
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  console.log(token, "token");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedPrice, setSelectedServicePrice] = useState(0);

  const [loading, setLoading] = useState(false);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!artistId) return; // don’t fetch without artist ID
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/artist-services/artist/${artistId}`,
          config
        );
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [artistId]);

  const handleChange = (event) => {
    const selected = JSON.parse(event.target.value);
    setSelectedServicePrice(selected.price);
    setSelectedService(JSON.stringify(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!artistId || !user) {
      alert("Artist or user not found!");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/bookings/${artistId}`,
        {
          name: user.name, // clientName
          clientId: user._id,
          date,
          service: JSON.parse(selectedService).id,
          price: selectedPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.href = data.url;
      // alert(`Thank you ${user.name}, your booking for ${date} is received!`);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed!");
    }
  };

  // 🎀 Updated Appointment Section (MUI styled)
  return (
    <Paper
      elevation={5}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        p: 4,
        borderRadius: 4,
        textAlign: "center",
        background: "linear-gradient(180deg, #fff8f9, #ffeef2)",
        boxShadow: "0 4px 16px rgba(255, 182, 193, 0.4)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
        sx={{
          color: "#b76e79", // soft rose gold
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Book Appointment
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {loading ? (
          <CircularProgress
            size={28}
            sx={{ display: "block", mx: "auto", color: "#b76e79" }}
          />
        ) : (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="service-select-label" sx={{ color: "#b76e79" }}>
              Select Service
            </InputLabel>
            <Select
              labelId="service-select-label"
              value={selectedService}
              label="Select Service"
              onChange={handleChange}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f4b5c0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b76e79",
                },
              }}
            >
              {services.map((service) => (
                <MenuItem key={service._id} value={JSON.stringify({
                  id: service._id,
                  price: service.price,
                  name: service.name,
                })}>
                  {service.name} — ₹{service.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          fullWidth
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "#f4b5c0" },
              "&:hover fieldset": { borderColor: "#b76e79" },
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            py: 1.3,
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: 3,
            textTransform: "none",
            background: "linear-gradient(90deg, #ffb6c1, #b76e79)",
            "&:hover": {
              background: "linear-gradient(90deg, #b76e79, #ff9aae)",
            },
          }}
        >
          Book Now
        </Button>
      </Box>
    </Paper>
  );
}
