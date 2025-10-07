import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import ArtistService from "../models/artistService.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// ✅ Create a new service
router.post("/", protect, async (req, res) => {
    try {
        const { name, price, description } = req.body;

        const service = new ArtistService({
            artistId: req.user.id,  // artist from token
            name,
            price,
            description,
        });

        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all services for logged-in artist
router.get("/", protect, async (req, res) => {
    try {
        const services = await ArtistService.find({ artistId: req.user.id });
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get a single service by ID
router.get("/:id", protect, async (req, res) => {
    try {
        const service = await ArtistService.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        // ensure only owner can view
        if (service.artistId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update service
router.put("/:id", protect, async (req, res) => {
    try {
        let service = await ArtistService.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        // only owner can update
        if (service.artistId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        service = await ArtistService.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete service
router.delete("/:id", protect, async (req, res) => {
    try {
        const service = await ArtistService.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        if (service.artistId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await service.deleteOne();
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// user apis
router.get("/artist/:artistId", protect, async (req, res) => {
    try {
        const { artistId } = req.params;

        // Find all services for this artist
        const services = await ArtistService.find({ artistId: artistId });

        if (!services.length) {
            return res.status(404).json({ message: "No services found for this artist" });
        }

        res.json(services);
    } catch (error) {
        console.error("Error fetching artist services:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
