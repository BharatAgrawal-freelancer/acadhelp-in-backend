import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ChapterSchema = new Schema(
  {
    subjectId: {
      type: Types.ObjectId,
      required: true,
      ref: "Subject"
    },

    TopicIds: [
  {
    type: Types.ObjectId,
    ref: "Topic",
    required: true
  }
],

img: {
  type: String
},

relatedImages: [
  {
    type: String
  }
],


    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    order: {
      type: Number,
      default: 0
    },

    description: {
      type: String
    },

    weightage: {
      type: Number
    },

    expectedQuestions: {
      min: Number,
      max: Number
    },

    totalTopics: {
      type: Number,
      default: 0
    },

    totalQuestions: {
      type: Number,
      default: 0
    },

    difficultyDistribution: {
      easy: {
        type: Number,
        default: 0
      },
      medium: {
        type: Number,
        default: 0
      },
      hard: {
        type: Number,
        default: 0
      }
    },

    examRelevance: [
      {
        exam: {
          type: String,
          enum: ["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "NEET"]
        },
        priority: {
          type: Number
        }
      }
    ],

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

export default mongoose.model("Chapter", ChapterSchema);
