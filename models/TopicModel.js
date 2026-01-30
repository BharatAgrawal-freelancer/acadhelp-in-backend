import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const TopicSchema = new Schema(
  {
    subjectId: {
      type: Types.ObjectId,
      required: true,
      ref: "Subject",
    },

    chapterId: {
      type: Types.ObjectId,
      required: true,
      ref: "Chapter",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
    },

    relatedImages: [
      {
        type: String,
      },
    ],

    relatedFormulaIds: [
      {
        type: Types.ObjectId,
        ref: "Formula",
      },
    ],

    relatedQuestionds: [
      {
        type: Types.ObjectId,
        ref: "Question",
      },
    ],

    conceptTags: [
      {
        type: String,
      },
    ],

    expectedQuestionCount: {
      type: Number,
      default: 0,
    },

    difficultyDistribution: {
      easy: {
        type: Number,
        default: 0,
      },
      medium: {
        type: Number,
        default: 0,
      },
      hard: {
        type: Number,
        default: 0,
      },
    },

    averageSolveTime: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ compound unique index
TopicSchema.index({ chapterId: 1, slug: 1 }, { unique: true });

export default mongoose.model("Topic", TopicSchema);
