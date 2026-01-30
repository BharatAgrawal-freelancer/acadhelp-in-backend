import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ComplaintSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: String,
      enum: [
        "TEST_ISSUE",
        "QUESTION_ERROR",
        "RESULT_PROBLEM",
        "PAYMENT",
        "TECHNICAL",
        "OTHER"
      ],
      required: true
    },

    relatedExamBatchId: {
      type: Types.ObjectId,
      ref: "ExamBatch"
    },

    relatedQuestionId: {
      type: Types.ObjectId,
      ref: "Question"
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "OPEN"
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    adminResponse: {
      type: String
    },

    resolvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Complaint", ComplaintSchema);
