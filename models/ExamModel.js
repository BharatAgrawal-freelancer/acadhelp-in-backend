import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ExamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
img: {
  type: String
},
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },

    conductingBody: {
      type: String
    },

    mode: {
      type: String,
      enum: ["CBT", "PEN_PAPER"],
      default: "CBT"
    },

    totalMarks: {
      type: Number,
      required: true
    },

    durationMinutes: {
      type: Number,
      required: true
    },

    markingScheme: {
      correct: {
        type: Number,
        required: true
      },
      incorrect: {
        type: Number,
        required: true
      },
      unattempted: {
        type: Number,
        default: 0
      }
    },

    sections: [
      {
        name: {
          type: String,
          required: true
        },

        subjectId: {
          type: Types.ObjectId,
          ref: "Subject"
        },

        totalQuestions: {
          type: Number
        },

        questionsToAttempt: {
          type: Number
        },

        marksPerQuestion: {
          type: Number
        },

        negativeMarks: {
          type: Number
        },

        isOptional: {
          type: Boolean,
          default: false
        },

        timeLimitMinutes: {
          type: Number
        }
      }
    ],

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

export default mongoose.model("Exam", ExamSchema);
