import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    videoId: {
      type: String,
      required: true,
      unique: true
    },
    link: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Text index for search
videoSchema.index({ title: "text" });

export default mongoose.model("Video", videoSchema);