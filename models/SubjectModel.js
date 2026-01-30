import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const SubjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    chapterIds: [
  {
    type: Types.ObjectId,
    ref: "Chapter",
    required: true
  }
],
relatedImages: [
  {
    type: String
  }
],


    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },

    description: {
      type: String
    },

    order: {
      type: Number,
      default: 0
    },


    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Subject", SubjectSchema);
