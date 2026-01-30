import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const RateAndReviewSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    examId: {
      type: Types.ObjectId,
      ref: "Exam"
    },

    examBatchId: {
      type: Types.ObjectId,
      ref: "ExamBatch"
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    review: {
      type: String,
      trim: true
    },

    isVerifiedAttempt: {
      type: Boolean,
      default: false
    },

    isVisible: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("RateAndReview", RateAndReviewSchema);
