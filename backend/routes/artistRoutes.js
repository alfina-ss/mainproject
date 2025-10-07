import express from "express";
import mongoose from "mongoose";
import Artist from "../models/artist.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";
import { protect, isArtist } from "../middleware/authMiddleWare.js";

const router = express.Router();


// -------- Artist Management --------

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
router.get("/", async (req, res) => {
    try {
        const artists = await User.find({ role: "artist" });
        res.json(artists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/all-users", async (req, res) => {
    try {
        const artists = await User.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/user-delete/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// @desc    Add a new artist
// @route   POST /api/artists
// @access  Public (later protect for admin/artist signup)
router.post("/", async (req, res) => {
    try {
        const { name, city, price, image, services } = req.body;
        const artist = new Artist({ name, city, price, image, services });
        const savedArtist = await artist.save();
        res.status(201).json(savedArtist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// -------- Availability --------
router.post("/:artistId/availability", protect, isArtist, async (req, res) => {
    try {
        const { artistId } = req.params;
        const { date, time } = req.body;

        const artist = await Artist.findById(artistId);
        if (!artist) return res.status(404).json({ message: "Artist not found" });

        artist.availability.push({ date, time });
        await artist.save();

        res.status(201).json({
            message: "Availability added",
            availability: artist.availability,
        });
    } catch (err) {
        res.status(500).json({ message: "Error adding availability", error: err.message });
    }
});

router.get("/:artistId/availability", protect, isArtist, async (req, res) => {
    try {
        const { artistId } = req.params;
        const artist = await Artist.findById(artistId);
        if (!artist) return res.status(404).json({ message: "Artist not found" });

        res.json(artist.availability);
    } catch (err) {
        res.status(500).json({ message: "Error fetching availability", error: err.message });
    }
});


// -------- Stats --------
router.get("/:artistId/stats", protect, isArtist, async (req, res) => {
    try {
        const { artistId } = req.params;

        const totalBookings = await Booking.countDocuments({ artist: artistId });
        const totalRevenue = await Booking.aggregate([
            { $match: { artist: new mongoose.Types.ObjectId(artistId) } },
            { $group: { _id: null, revenue: { $sum: "$price" } } },
        ]);
        const totalClients = await Booking.distinct("user", { artist: artistId });

        res.json({
            bookings: totalBookings,
            revenue: totalRevenue[0]?.revenue || 0,
            clients: totalClients.length,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats", error: err.message });
    }
});


// -------- Appointments --------
router.post("/:artistId/appointments", protect, async (req, res) => {
    try {
        const { name, service, date, price } = req.body;
        if (!name || !date) {
            return res.status(400).json({ message: "Name and Date are required" });
        }

        const booking = await Booking.create({
            artist: req.params.artistId,
            user: req.user?._id, // optional if logged-in user
            clientName: name,
            service: service || "General Service",
            date,
            price: price || 0,
        });

        res.status(201).json({ message: "Appointment booked", booking });
    } catch (err) {
        res.status(500).json({ message: "Error booking appointment", error: err.message });
    }
});

router.get("/:artistId/appointments", protect, async (req, res) => {
    try {
        const { artistId } = req.params;
        const appointments = await Booking.find({ artist: artistId }).sort({ date: 1 });
        res.json({ appointments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

router.patch("/appointments/:appointmentId", protect, async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const appointment = await Booking.findByIdAndUpdate(
            req.params.appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        res.json({ message: "Status updated", appointment });
    } catch (err) {
        res.status(500).json({ message: "Error updating status", error: err.message });
    }
});


// -------- Approve User (Accept Request) --------
// @desc    Approve a user (set status: "approved")
// @route   PUT /api/artists/approve/:id
// @access  Private (Admin only)
router.put("/approve/:id", protect, async (req, res) => {
    try {
        // Optional: ensure only admin can approve
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.status = "approved";
        await user.save();

        res.json({ message: "User approved successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while approving user" });
    }
});



export default router;
