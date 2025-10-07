import mongoose from "mongoose";

const artistDateSchema = new mongoose.Schema(
    {
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to Artist model
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true, // true = available, false = booked/unavailable
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ArtistDate", artistDateSchema);
