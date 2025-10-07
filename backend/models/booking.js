// models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bookingUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        service: { type: mongoose.Schema.Types.ObjectId, ref: "ArtistService", required: true },
        date: { type: Date, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "confirmed",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
