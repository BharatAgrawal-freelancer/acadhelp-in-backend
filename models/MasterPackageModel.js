import mongoose from "mongoose";

const masterPackagePdfSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      required: true, // physics / chemistry / mathematics
    },

    chapterName: {
      type: String,
      required: true,
    },

    pdfUrl: {
      type: String,
      required: true, // Cloudinary raw PDF link
    },
  },
  { timestamps: true }
);

export default mongoose.model("MasterPackage", masterPackagePdfSchema);
