import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bio: String,
    experience: Number,
    skills: [String],
    // services: [
    //   {
    //     name: String,
    //     price: Number,
    //     duration: String
    //   }
    // ],
    availability: {
      type: Map,
      of: Boolean, // {"2025-10-01 14:00": true}
      default: {}
    }
  },
  { timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
