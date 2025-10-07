import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import artistRoutes from "./routes/artistRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import artistDateRoutes from "./routes/artistDateRoutes.js";
import artistServiceRoutes from "./routes/artistServiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import nodemailer from "nodemailer";


// Import DB connection
import connectDB from "./db/connection.js";

dotenv.config();

// Initialize app
const app = express();

import "./models/booking.js";
import "./models/service.js";


// Middleware
app.use(express.json());
app.use(cors());

app.post("/send", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // example for Gmail
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS, // app password
            },
        });

        await transporter.sendMail({
            from: email,
            to: "alfiizz123@gmail.com", // where you want to receive messages
            subject: subject,
            html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
        });

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email", detail: error.message });
    }
});


// Routes
app.use("/api/artists", artistRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/artist-dates", artistDateRoutes);
app.use("/api/artist-services", artistServiceRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});
