import Booking from "../models/booking.js";
import Artist from "../models/artist.js";

export const createBooking = async (req, res) => {
    try {
        const { artistId } = req.params;
        const { name, clientId, date } = req.body;

        const artist = await Artist.findById(artistId);
        if (!artist) return res.status(404).json({ message: "Artist not found" });

        const booking = await Booking.create({
            clientName: name,
            clientId,
            artist: artistId,
            date: new Date(date),
            service: "General Service",
            price: 1000,
        });

        res.status(201).json({ message: "Booking created", booking });
    } catch (err) {
        res.status(500).json({ message: "Error creating booking", error: err.message });
    }
};

export const getBookingsByArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        const bookings = await Booking.find({ artist: artistId }).sort({ date: 1 });
        res.json({ appointments: bookings });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookingjijijijijs", error: err.message });
    }
};
