import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

import Booking from "../models/booking.js";
import Artist from "../models/artist.js";
import { protect } from "../middleware/authMiddleWare.js";
import User from "../models/user.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // store key in .env


// payment
router.post("/create-checkout-session", async (req, res) => {
    try {
        const { price, serviceName } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: { name: serviceName },
                        unit_amount: price * 100, // convert ₹ to paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/booking/68e2224ca92e0ad4e1aa45fd`,
            cancel_url: `http://localhost:5173/booking/68e2224ca92e0ad4e1aa45fd`,
        });

        res.json({ url: session.url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Stripe session creation failed", message: err.message });
    }
});


// -------- Create Booking --------
// @route POST /api/bookings/:artistId
router.post("/:artistId", protect, async (req, res) => {
    try {
        const { artistId } = req.params;
        const { name, clientId, date, service, price } = req.body;

        const artist = await User.findById(artistId);
        if (!artist) return res.status(404).json({ message: "Artist not found" });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: { name: name },
                        unit_amount: price * 100, // convert ₹ to paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/booking/68e2224ca92e0ad4e1aa45fd`,
            cancel_url: `http://localhost:5173/booking/68e2224ca92e0ad4e1aa45fd`,
        });

        const booking = await Booking.create({
            clientName: name,
            clientId,
            artist: artistId,
            date: new Date(date),
            service: service,
            price: price,
            bookingUser: req.user.id
        });

        res.status(201).json({ message: "Booking created", url: session.url, booking });
    } catch (err) {
        res.status(500).json({ message: "Error creating booking", error: err.message });
    }
});

router.get("/artists-bookings", protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ artist: req.user.id })
            .populate("bookingUser", "name")
            .populate("service", "title")
            .sort({ date: 1 });
        res.json({ bookings: bookings });
    } catch (err) {
        res.status(500).json({ message: "Error fetching booiiiiikings", error: err.message });
    }
});
router.get("/user", protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ bookingUser: req.user.id })
            .populate("artist", "name")
            .sort({ date: 1 });
        res.json({ bookings: bookings });
    } catch (err) {
        res.status(500).json({ message: "Error fetching booiiiiikings", error: req.user._id });
    }
});
// -------- Get Bookings by Artist --------
// @route GET /api/bookings/:artistId
router.get("/:artistId", protect, async (req, res) => {
    try {
        const { artistId } = req.params;
        const bookings = await Booking.find({ artist: artistId })
            .sort({ date: 1 });
        res.json({ appointments: bookings });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings of artists", error: err.message });
    }
});


// -------- Delete Booking --------
// @route DELETE /api/bookings/:id
router.delete("/:id", protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Only the user who booked it can delete
        if (booking.bookingUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this booking" });
        }

        await booking.deleteOne();
        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting booking", error: err.message });
    }
});



export default router;
