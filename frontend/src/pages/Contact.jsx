import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/send", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Failed to send message.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 3, px: { xs: 2, sm: 4 }, backgroundColor: "#f5f5f5" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#658304ff", textAlign: "center", fontFamily: "aries", mb: 3, fontSize: "1.2rem" }}>
        Contact Us
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontFamily: "aries", mb: 1.5 }}>Get in Touch</Typography>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="dense" size="small" />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" size="small" />
            <TextField label="Subject" name="subject" value={formData.subject} onChange={handleChange} fullWidth margin="dense" size="small" />
            <TextField label="Message" name="message" value={formData.message} onChange={handleChange} fullWidth multiline rows={4} margin="dense" size="small" />
            <Button onClick={handleSubmit} disabled={loading} variant="contained" color="primary" fullWidth sx={{ mt: 2, borderRadius: 2, textTransform: "none", py: 1 }}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2, backgroundColor: "#ffffffcc" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Contact Information</Typography>
            <Typography sx={{ mb: 0.5, fontSize: "0.9rem" }}><strong>Email:</strong> info@glamora.com</Typography>
            <Typography sx={{ mb: 0.5, fontSize: "0.9rem" }}><strong>Phone:</strong> +91 98765 43210</Typography>
            <Typography sx={{ mb: 0.5, fontSize: "0.9rem" }}><strong>Address:</strong> 123 Beauty Street, Hyderabad, India</Typography>
            <Typography sx={{ mt: 2, color: "#4b5563", fontSize: "0.85rem" }}>Fill out the form and our team will get back to you promptly.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
