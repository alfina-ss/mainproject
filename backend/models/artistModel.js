import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    services: [{ type: String }]
}, { timestamps: true });

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
