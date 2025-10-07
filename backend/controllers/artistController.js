import mongoose from "mongoose";
import Artist from "../models/artist.js";
import Booking from "../models/booking.js";

// -------- Availability --------
export const addAvailability = async (req, res) => {
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
};

export const getAvailability = async (req, res) => {
    try {
        const { artistId } = req.params;
        const artist = await Artist.findById(artistId);
        if (!artist) return res.status(404).json({ message: "Artist not found" });

        res.json(artist.availability);
    } catch (err) {
        res.status(500).json({ message: "Error fetching availability", error: err.message });
    }
};

// -------- Stats --------
export const getDashboardStats = async (req, res) => {
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
};

// -------- Appointments --------
export const addAppointment = async (req, res) => {
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
};

export const getAppointments = async (req, res) => {
    try {
        const { artistId } = req.params;
        const appointments = await Booking.find({ artist: artistId }).sort({ date: 1 });
        res.json({ appointments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
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
};
