import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String } // optional image
}, { timestamps: true });

export default mongoose.model("service", serviceSchema);
