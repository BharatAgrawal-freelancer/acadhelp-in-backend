import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const FeedbackSchema = new Schema(
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

    feedbackType: {
      type: String,
      enum: [
        "PLATFORM",
        "TEST_SERIES",
        "EXAM_INTERFACE",
        "ANALYTICS",
        "SUGGESTION"
      ],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    sentiment: {
      type: String,
      enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"]
    },

    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Feedback", FeedbackSchema);
