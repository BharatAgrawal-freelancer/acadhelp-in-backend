import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ErrorSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "CONCEPTUAL",
        "CALCULATION",
        "FORMULA_CONFUSION",
        "TIME_PRESSURE",
        "SILLY_MISTAKE",
        "GUESS"
      ]
    },

    description: {
      type: String
    },

    relatedSubjectId: {
      type: Types.ObjectId,
      ref: "Subject"
    },

    relatedChapterId: {
      type: Types.ObjectId,
      ref: "Chapter"
    },

    relatedTopicId: {
      type: Types.ObjectId,
      ref: "Topic"
    },

    relatedFormulaIds: [
      {
        type: Types.ObjectId,
        ref: "Formula"
      }
    ],

    severityLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    isSystemGenerated: {
      type: Boolean,
      default: false
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

export default mongoose.model("Error", ErrorSchema);
