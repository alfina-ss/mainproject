import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function About() {
  return (
    <Box sx={{ backgroundColor: "#fafafa", py: 6, px: { xs: 2, sm: 6 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", fontFamily: "aries", color: "#4f4747e1" }}
        >
         ' Unleash Your Inner Glow'
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4b5563",
            fontSize: "1.125rem",
            fontFamily: "aries",
            mt: 2,
            maxWidth: 800,
            mx: "auto",
            lineHeight: 1.8,
          }}
        >
          Book your perfect makeover for weddings, parties, and special events!
          At <strong>Glamora</strong>, we bring out the best in you with
          personalized beauty services, premium products, and professional
          techniques.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 4,
          mb: 6,
          backgroundColor: "#ffffff",
          maxWidth: 900,
          mx: "auto",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontFamily: "aries",
            color: "#4f4747e1",
            mb: 2,
            textAlign: "center",
          }}
        >
          Our Mission
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4b5563",
            fontFamily: "aries",
            textAlign: "center",
            lineHeight: 1.75,
          }}
        >
          At Glamora, we aim to provide seamless access to professional makeup
          artists across India. Every individual deserves to look and feel their
          best, and we make beauty services accessible, reliable, and affordable.
        </Typography>
      </Paper>

      {/* Why Choose Us + Services */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#fff",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 6,
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontFamily: "aries",
                color: "#4f4747e1",
                mb: 2,
              }}
            >
              Why Choose Us?
            </Typography>
            <List sx={{ color: "#4b5563" }}>
              {[
                "Curated list of top makeup artists for weddings, parties, and events.",
                "Personalized consultations and customized beauty plans.",
                "Airbrush, HD, and traditional makeup techniques.",
                "Artists travel to your venue for a hassle-free experience.",
                "Secure booking, transparent pricing, and reliable service.",
              ].map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CheckIcon sx={{ color: "#658304ff" }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#fff",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 6,
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontFamily: "aries",
                color: "#4f4747e1",
                mb: 2,
              }}
            >
              Our Services
            </Typography>
            <List sx={{ color: "#4b5563" }}>
              {[
                "Bridal Makeup (Traditional & Modern)",
                "Party & Event Makeup",
                "Airbrush Makeup",
                "Hair Styling & Pre-Bridal Grooming",
                "Customized Beauty Packages",
              ].map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CheckIcon sx={{ color: "#658304ff" }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Our Promise */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 4,
          mt: 6,
          backgroundColor: "#ffffff",
          maxWidth: 900,
          mx: "auto",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontFamily: "aries",
            color: "#4f4747e1",
            mb: 2,
            textAlign: "center",
          }}
        >
          Our Promise
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4b5563",
            fontFamily: "aries",
            textAlign: "center",
            lineHeight: 1.75,
          }}
        >
          We prioritize client satisfaction and artistry in every makeup session.
          From booking to the final look, our focus is delivering confidence,
          beauty, and a memorable experience. Glamora is not just a service;
          it’s a journey to look your absolute best.
        </Typography>
      </Paper>
    </Box>
  );
}
