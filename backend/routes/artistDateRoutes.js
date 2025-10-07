import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();


// ------------------ Mongoose Model ------------------
const artistDateSchema = new mongoose.Schema(
    {
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const ArtistDate = mongoose.model("ArtistDate", artistDateSchema);


// ------------------ Middleware ------------------
const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded; // { id: artistId }
            return next();
        } catch (err) {
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};


// ------------------ Routes (with controllers inline) ------------------

// ✅ Create date (requires login)
router.post("/", protect, async (req, res) => {
    try {
        const { date, isAvailable, notes } = req.body;

        const newDate = new ArtistDate({
            artistId: req.user.id, // taken from token
            date,
            isAvailable,
            notes,
        });

        await newDate.save();
        res.status(201).json(newDate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all dates (optionally filter by artistId)
router.get("/", protect, async (req, res) => {
    try {
        const artistId = req.user.id; // taken from token

        const dates = await ArtistDate.find({ artistId }).populate("artistId", "name");
        res.json(dates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get single date by ID
router.get("/:id", async (req, res) => {
    try {
        const date = await ArtistDate.findById(req.params.id).populate("artistId", "name");
        if (!date) return res.status(404).json({ message: "Date not found" });
        res.json(date);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update a date (only owner)
router.put("/:id", protect, async (req, res) => {
    try {
        let date = await ArtistDate.findById(req.params.id);
        if (!date) return res.status(404).json({ message: "Date not found" });

        if (date.artistId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this date" });
        }

        date = await ArtistDate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(date);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete a date (only owner)
router.delete("/:id", protect, async (req, res) => {
    try {
        const date = await ArtistDate.findById(req.params.id);
        if (!date) return res.status(404).json({ message: "Date not found" });

        if (date.artistId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this date" });
        }

        await date.deleteOne();
        res.json({ message: "Date deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
